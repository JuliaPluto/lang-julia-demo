import { HighlightStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// A deliberately vivid palette: we map as many distinct lexical tags as
// possible to distinct colors so the difference in *granularity* between
// the two parsers is obvious at a glance.
export const colorfulHighlight = HighlightStyle.define([
  // Comments
  { tag: [t.comment, t.lineComment, t.blockComment], color: "#6a7b86", fontStyle: "italic" },
  { tag: t.docComment, color: "#8fae9b", fontStyle: "italic" },

  // Keywords — split into many sub-kinds
  { tag: t.keyword, color: "#ff79c6", fontWeight: "bold" },
  { tag: t.controlKeyword, color: "#ff5fa2", fontWeight: "bold" },
  { tag: t.operatorKeyword, color: "#ff92d0" },
  { tag: t.definitionKeyword, color: "#c792ea", fontWeight: "bold" },
  { tag: t.moduleKeyword, color: "#bd93f9", fontWeight: "bold" },

  // Plain identifiers
  { tag: t.variableName, color: "#e6e6e6" },
  { tag: t.local(t.variableName), color: "#bce0ff", fontStyle: "italic" },
  { tag: t.labelName, color: "#ff9d5c" },

  // Function calls vs. function definitions (context-aware — only the new parser)
  { tag: t.function(t.variableName), color: "#82e9ff" },
  { tag: t.function(t.definition(t.variableName)), color: "#ffe066", fontWeight: "bold" },

  // Property / field access, keyword arguments
  { tag: t.propertyName, color: "#82aaff" },
  { tag: t.attributeName, color: "#ffa657", fontStyle: "italic" },

  // Types & classes
  { tag: t.typeName, color: "#5ad4a6" },
  { tag: t.className, color: "#4ec9b0" },
  { tag: t.definition(t.className), color: "#7bffce", fontWeight: "bold" },
  { tag: t.namespace, color: "#7fdbca" },
  { tag: t.definition(t.namespace), color: "#a6f0e0", fontWeight: "bold" },

  // Macros / meta / annotations
  { tag: t.macroName, color: "#ffb86c", fontWeight: "bold" },
  { tag: t.special(t.macroName), color: "#ff9e3d", fontWeight: "bold" },
  { tag: t.meta, color: "#ffb86c" },
  { tag: t.annotation, color: "#ffb86c" },
  { tag: t.modifier, color: "#f78c6c" },

  // Literals — integers and floats get *different* colors
  { tag: t.integer, color: "#f78c6c" },
  { tag: t.float, color: "#ffc177" },
  { tag: t.number, color: "#f78c6c" },
  { tag: t.bool, color: "#ff5370", fontWeight: "bold" },
  { tag: [t.atom, t.constant(t.variableName)], color: "#ff5370" },
  { tag: t.self, color: "#ff5370", fontStyle: "italic" },
  { tag: t.null, color: "#ff5370" },
  { tag: t.unit, color: "#f78c6c" },

  // Strings & friends
  { tag: t.string, color: "#c3e88d" },
  { tag: t.special(t.string), color: "#7fdbca", fontWeight: "bold" }, // string interpolation
  { tag: t.docString, color: "#a5d66f" },
  { tag: t.character, color: "#e9ff7d" },
  { tag: t.regexp, color: "#f8c555" },
  { tag: t.escape, color: "#ff8b50", fontWeight: "bold" },
  { tag: t.url, color: "#80cbc4", textDecoration: "underline" },

  // Operators — split into many sub-kinds
  { tag: t.operator, color: "#89ddff" },
  { tag: t.arithmeticOperator, color: "#89ddff" },
  { tag: t.logicOperator, color: "#ff79c6" },
  { tag: t.bitwiseOperator, color: "#c792ea" },
  { tag: t.compareOperator, color: "#f07178" },
  { tag: t.definitionOperator, color: "#ffcb6b" },
  { tag: t.updateOperator, color: "#ffcb6b" },
  { tag: t.typeOperator, color: "#5ad4a6" },
  { tag: t.controlOperator, color: "#ff6e9c" },

  // Punctuation & brackets
  { tag: t.punctuation, color: "#abb2bf" },
  { tag: t.separator, color: "#7f8c98" },
  { tag: t.paren, color: "#ffd700" },
  { tag: t.squareBracket, color: "#da70d6" },
  { tag: t.brace, color: "#5ad4a6" },
  { tag: t.angleBracket, color: "#89ddff" },
  { tag: t.special(t.bracket), color: "#ff7eb6", fontWeight: "bold" }, // interpolation `$(` `)`

  // Misc
  { tag: t.invalid, color: "#ffffff", background: "#ff5370" },
  { tag: t.heading, color: "#82aaff", fontWeight: "bold" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
]);
