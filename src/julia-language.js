import { LanguageSupport } from "@codemirror/language";
import { julia, juliaLanguage } from "@plutojl/lang-julia";
import { styleTags, tags as t } from "@lezer/highlight";

// The Lezer Julia grammar tags every identifier the same way (`variableName`),
// so definitions, function calls and keyword args all look alike out of the
// box. Here we layer on *context-aware* style rules — keyed by their position
// in the syntax tree — to give each role its own color. This is exactly the
// kind of structural distinction the legacy regex mode cannot make.
const extraStyles = styleTags({
  // Every function-call head, e.g. `push!(...)`, `sqrt(x)`.
  "CallExpression/Identifier": t.function(t.variableName),

  // Long-form function definition names — more specific than the rule above,
  // so these win: `function kinetic(...)` → `kinetic`.
  "FunctionDefinition/Signature/CallExpression/Identifier": t.function(t.definition(t.variableName)),

  // Type definition names: `struct Particle`, `abstract type Shape`, etc.
  "StructDefinition/TypeHead/Identifier": t.definition(t.className),
  "StructDefinition/TypeHead/ParametrizedExpression/Identifier": t.definition(t.className),
  "AbstractDefinition/TypeHead/Identifier": t.definition(t.className),
  "AbstractDefinition/TypeHead/ParametrizedExpression/Identifier": t.definition(t.className),
  "PrimitiveDefinition/TypeHead/Identifier": t.definition(t.className),

  // Module names: `module Showcase`.
  "ModuleDefinition/Identifier": t.definition(t.namespace),

  // Keyword-argument names at a call/definition site: `steps = 1_000`.
  "KwArg/Identifier": t.attributeName,
});

// A highlight rule is a small linked-list node: { tags, mode, context, next }.
// `getStyleTags` walks the chain and returns the FIRST rule whose context
// matches, so the chain MUST be ordered most-specific-first.
function isRule(v) {
  return v && typeof v === "object" && "mode" in v && Array.isArray(v.tags) && "context" in v;
}
function ruleDepth(r) {
  return r.context ? r.context.length : 0;
}

// `styleTags()` sorts rules by specificity within a single call, but when a
// SECOND styleTags source is merged onto a node that the grammar already
// styled, the combiner just *appends* — leaving the grammar's catch-all
// (depth-0) rule ahead of our deeper context rules, so ours never match.
// Re-sort each rule chain by decreasing depth to restore the invariant.
// Clones preserve the Rule prototype (its `opaque`/`inherit` getters) and
// avoid mutating the shared base grammar.
function resortHighlightRules(nodeSet) {
  for (const type of nodeSet.types) {
    const props = type.props;
    if (!props) continue;
    for (const id of Object.keys(props)) {
      const head = props[id];
      if (!isRule(head)) continue;
      const rules = [];
      for (let r = head; r; r = r.next) {
        const clone = Object.create(Object.getPrototypeOf(r));
        clone.tags = r.tags;
        clone.mode = r.mode;
        clone.context = r.context;
        clone.next = undefined;
        rules.push(clone);
      }
      // Stable sort keeps the grammar's original ordering among equal depths.
      rules.sort((a, b) => ruleDepth(b) - ruleDepth(a));
      for (let i = 0; i < rules.length; i++) rules[i].next = rules[i + 1];
      props[id] = rules[0];
    }
  }
}

// `LRLanguage.configure` returns a new language whose parser carries the extra
// props; then we fix the rule ordering on that parser's node set.
const enhancedJuliaLanguage = juliaLanguage.configure({ props: [extraStyles] });
resortHighlightRules(enhancedJuliaLanguage.parser.nodeSet);

export function juliaEnhanced(config) {
  // Reuse julia()'s extensions (keyword completion, etc.) but swap in the
  // enhanced language definition.
  const base = julia(config);
  return new LanguageSupport(enhancedJuliaLanguage, base.support);
}
