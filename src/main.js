import { EditorState, Annotation } from "@codemirror/state";
import { EditorView, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { syntaxHighlighting, indentOnInput, bracketMatching, StreamLanguage } from "@codemirror/language";
import { julia as juliaLegacy } from "@codemirror/legacy-modes/mode/julia";

import { juliaEnhanced } from "./julia-language.js";
import { colorfulHighlight } from "./highlight.js";
import sampleCode from "./showcase.jl?raw";

// Changes we push for syncing carry this annotation so the listener can
// ignore them and avoid an infinite echo between the two editors.
const fromSync = Annotation.define();

// Shared editor chrome: the *only* difference between the panes is the
// language extension, so any visual difference is down to the parser.
function makeEditor(parent, langExtension, peer) {
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc: sampleCode,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        indentOnInput(),
        bracketMatching(),
        syntaxHighlighting(colorfulHighlight),
        EditorView.lineWrapping,
        langExtension,
        EditorView.updateListener.of((update) => {
          if (!update.docChanged) return;
          if (update.transactions.some((tr) => tr.annotation(fromSync))) return;
          const other = peer();
          if (!other) return;
          const text = update.state.doc.toString();
          if (text === other.state.doc.toString()) return;
          other.dispatch({
            changes: { from: 0, to: other.state.doc.length, insert: text },
            annotations: fromSync.of(true),
          });
        }),
      ],
    }),
  });
  return view;
}

let modernView, legacyView;
modernView = makeEditor(document.querySelector("#editor-modern"), juliaEnhanced(), () => legacyView);
legacyView = makeEditor(document.querySelector("#editor-legacy"), StreamLanguage.define(juliaLegacy), () => modernView);
