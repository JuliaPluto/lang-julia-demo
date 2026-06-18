import { defineConfig } from "vite";

export default defineConfig({
  // Build with relative asset paths so the site can be hosted from any
  // subdirectory (e.g. GitHub Pages project sites).
  base: "./",
  server: {
    open: true,
  },
  resolve: {
    // The local `@plutojl/lang-julia` is linked via `file:..`, so it ships
    // its own copies of the CodeMirror/Lezer packages. Force a single copy
    // of each, otherwise `instanceof` checks across package boundaries fail
    // ("multiple instances of @codemirror/state are loaded").
    dedupe: [
      "@codemirror/state",
      "@codemirror/view",
      "@codemirror/language",
      "@codemirror/commands",
      "@codemirror/autocomplete",
      "@lezer/common",
      "@lezer/highlight",
      "@lezer/lr",
    ],
  },
});
