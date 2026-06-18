# lang-julia demo — CodeMirror 6 vs. legacy CM5 Julia highlighting

A tiny [Vite](https://vitejs.dev) site that puts two CodeMirror 6 editors
side by side, both showing the same chunk of modern Julia and sharing the
exact same colorful `HighlightStyle`. The **only** difference between the
two panes is the language parser:

| Pane | Parser | Source |
| --- | --- | --- |
| **NEW** | [`@plutojl/lang-julia`](https://www.npmjs.com/package/@plutojl/lang-julia) | a real [Lezer](https://lezer.codemirror.net) grammar |
| **LEGACY** | `@codemirror/legacy-modes/mode/julia` | the ported CodeMirror 5 stream parser most CM6 projects still use |

Because the theme is shared, every visible difference comes down to how
each parser tokenizes the code — function definitions vs. calls, type and
module definitions, keyword arguments, macros, string interpolation,
regex / raw / byte strings, integer vs. float literals, and every flavor of
keyword and operator.

## Develop

```sh
npm install
npm run dev      # http://localhost:5173
```

## Build

```sh
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## Deploy (GitHub Pages)

This repo ships a GitHub Actions workflow (`.github/workflows/deploy.yml`)
that builds the site and publishes it to GitHub Pages on every push to
`main`.

To turn it on once: in the repo's **Settings → Pages**, set **Source** to
**GitHub Actions**. After the next push (or a manual run from the Actions
tab), the site is live at `https://<user>.github.io/<repo>/`.

The Vite `base` is set to `"./"` (relative asset paths), so the site works
from any subpath — no need to hard-code the repository name.

## How it works

- `src/showcase.jl` — the sample code, imported raw via Vite's `?raw`
  suffix so we don't have to escape Julia's backticks and `$`.
- `src/highlight.js` — a deliberately vivid palette mapping as many
  distinct `@lezer/highlight` tags as possible to distinct colors.
- `src/julia-language.js` — layers *context-aware* style rules onto the
  grammar so definitions, calls, type/module names and keyword arguments
  each get their own color. The grammar tags every identifier the same
  (`variableName`); we add rules keyed by syntax-tree position (e.g.
  `FunctionDefinition/Signature/CallExpression/Identifier`). One gotcha:
  merging a second `styleTags` source onto a node the grammar already
  styled just *appends* the new rules, leaving the grammar's catch-all rule
  ahead of ours, so they never match — `resortHighlightRules` re-sorts each
  rule chain most-specific-first to fix that.
- `src/main.js` — builds the two editors and keeps them text-synced.
- `vite.config.js` — dedupes the CodeMirror/Lezer packages so `instanceof`
  checks across package boundaries don't break.
