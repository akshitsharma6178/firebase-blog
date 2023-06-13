import { useEffect, useRef, useState } from "react";
import {
    ContentBlock,
    // ContentBlock,
  DraftStyleMap,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
  Editor,
  // AtomicBlockUtils,
} from "draft-js";
import Toolbar from "./toolbar";
import './textEditor.css'
import { ImageComponent } from "../image/image";

interface propStructure {
    setMethod?: (arg0: string) => void;
    isViewOnly: boolean;
    editorStateData?: string
}

export function TextEditor(props : propStructure) {
  const [editorState, setEditorState] = useState(() => {
    const contentState = props.editorStateData ? convertFromRaw(JSON.parse(props.editorStateData)) : null
    return contentState ? EditorState.createWithContent(contentState) : EditorState.createEmpty()
  }
  );
  // const [imageURL, setImageURL] = useState("");
  const [isActive, setIsActive] = useState(false)
  // const [scrollable, setScrollable] = useState(false);
  const editor = useRef<Editor>(null);


  useEffect(() => {
    const setEditorData = () => {
      const data = props.editorStateData ? convertFromRaw(JSON.parse(props.editorStateData)) : null
      const editorState = data ? EditorState.createWithContent(data) : null
      editorState ?  setEditorState(editorState) : null
    }
    setEditorData();
  }, [props]);

  const focusEditor = () => {
    editor.current?.focus();
  };

  // const insertImage = (url: string) => {
  //   const contentState = editorState.getCurrentContent();
  //   const contentStateWithEntity = contentState.createEntity("IMAGE", "IMMUTABLE", { src: url });
  //   const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  //   const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
  //   setEditorState(
  //     AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
  //   );
  // };

  
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
  const blockRendererFn = (contentBlock : ContentBlock) => {
    if (contentBlock.getType() === 'atomic') {
      const entityKey = contentBlock.getEntityAt(0);
      if (entityKey) {
        const entity = editorState.getCurrentContent().getEntity(entityKey);
        const entityType = entity.getType();
        if (entityType === 'IMAGE') {
          return {
            component: ImageComponent,
            editable: false,
          };
        }
      }
    }
    return null;
  };
  // function handleGradient(){
  //   const container = containerRef.current;
  //   const content = contentRef.current;
  //   if (container && content && (content.offsetHeight > container.offsetHeight)) {
  //     setScrollable(true);
  //   }
  //   else {
  //     setScrollable(false);
  //   }

  // }
  return (
    <div className={`${props.isViewOnly? 'view-editor-wrapper' : 'editor-wrapper'} ${isActive ? 'active' : ''}`} onClick={focusEditor}>
        {!props.isViewOnly ?  
        <Toolbar editorState={editorState} setEditorState={setEditorState}/>
          : <></>
        }
      <div  className={`editor-container`}>
        <Editor
          placeholder={props.isViewOnly? '' : 'Text (Optional)'}
          handleKeyCommand={handleKeyCommand}
          editorState={editorState}
          readOnly={props.isViewOnly}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          customStyleMap={styleMap}
          blockStyleFn={myBlockStyleFn}
          blockRendererFn={blockRendererFn}
          onChange={(editorState) => {
            const contentState = editorState.getCurrentContent()
            setEditorState(editorState)
            props.setMethod? props.setMethod(JSON.stringify(convertToRaw(contentState))) : null;
          }}
        />
      </div>
    </div>
  );
}

