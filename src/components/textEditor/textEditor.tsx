import { useEffect, useRef, useState } from "react";
import {
    ContentBlock,
    // ContentBlock,
  DraftStyleMap,
  Editor,
  EditorState,
  RichUtils,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "./textEditor.css";
import Toolbar from "./toolbar";

interface propStructure {
    setMethod: (arg0: string) => void;
}

export function TextEditor(props : propStructure) {
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty()
  );
  const [isActive, setIsActive] = useState(false)
  const editor = useRef<Editor>(null);

  useEffect(() => {
    focusEditor();
  }, []);

  const focusEditor = () => {
    editor.current?.focus();
  };

  
  const handleKeyCommand= (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };
  // FOR INLINE STYLES
  const styleMap: DraftStyleMap = {
    CODE: {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
    HIGHLIGHT: {
      backgroundColor: "#F7A5F7",
    },
    UPPERCASE: {
      textTransform: "uppercase",
    },
    LOWERCASE: {
      textTransform: "lowercase",
    },
    CODEBLOCK: {
      fontFamily: '"fira-code", "monospace"',
      fontSize: "inherit",
      background: "#ffeff0",
      fontStyle: "italic",
      lineHeight: 1.5,
      padding: "0.3rem 0.5rem",
      borderRadius: " 0.2rem",
    },
    SUPERSCRIPT: {
      verticalAlign: "super",
      fontSize: "80%",
    },
    SUBSCRIPT: {
      verticalAlign: "sub",
      fontSize: "80%",
    },
  };

//   FOR BLOCK LEVEL STYLES(Returns CSS Class From DraftEditor.css)
  const myBlockStyleFn = (contentBlock :ContentBlock) => {
    const type = contentBlock.getType();
    switch (type) {
      case "blockQuote":
        return "superFancyBlockquote";
      case "leftAlign":
        return "leftAlign";
      case "rightAlign":
        return "rightAlign";
      case "centerAlign":
        return "centerAlign";
      case "justifyAlign":
        return "justifyAlign";
      default:
        return ""
    }
  };

  return (
    <div className={`editor-wrapper ${isActive ? 'active' : ''}`} onClick={focusEditor}>
        <Toolbar editorState={editorState} setEditorState={setEditorState}/>
      <div className="editor-container">
        <Editor
          ref={editor}
          placeholder="Text (Optional)"
          handleKeyCommand={handleKeyCommand}
          editorState={editorState}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          customStyleMap={styleMap}
          blockStyleFn={myBlockStyleFn}
          onChange={(editorState) => {
            const contentState = editorState.getCurrentContent();
            setEditorState(editorState)
            props.setMethod(stateToHTML(contentState));
          }}
        />
      </div>
    </div>
  );
}

