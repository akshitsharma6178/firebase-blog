import { Button } from '@mui/material';
import { AtomicBlockUtils, EditorState, RichUtils } from 'draft-js';
import { ReactNode, MouseEvent, useRef } from 'react';
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaTextWidth,
  FaListUl,
  FaListOl,
  FaCode,
  FaQuoteRight,
  FaHeading,
  FaImage,
} from 'react-icons/fa';
import { uploadImageToFirebase } from '../../services/firebase';

interface Tool {
  label: string;
  style: string;
  icon?: ReactNode;
  method: string;
}

interface ToolbarProps {
  editorState: EditorState;
  setEditorState: (state: EditorState) => void;
  // insertImage: (url: string) => void;
}

const Toolbar = ({ editorState, setEditorState}: ToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tools: Tool[] = [
    {
      label: "bold",
      style: "BOLD",
      icon: <FaBold/>,
      method: "inline",
    },
    {
      label: "italic",
      style: "ITALIC",
      icon: <FaItalic/>,
      method: "inline",
    },
    {
      label: "strike-through",
      style: "STRIKETHROUGH",
      icon: <FaStrikethrough />,
      method: "inline",
    },
    {
      label: "Monospace",
      style: "CODE",
      icon: <FaTextWidth/>,
      method: "inline",
    },
    {
      label: "Blockquote",
      style: "blockQuote",
      icon: <FaQuoteRight/>,
      method: "block",
    },
    {
      label: "Unordered-List",
      style: "unordered-list-item",
      method: "block",
      icon: <FaListUl />,
    },
    {
      label: "Ordered-List",
      style: "ordered-list-item",
      method: "block",
      icon: <FaListOl />,
    },
    {
      label: "Code Block",
      style: "CODEBLOCK",
      icon: <FaCode />,
      method: "inline",
    },
    { 
      label: "Heading", 
      style: "header-one", 
      icon: <FaHeading/>, 
      method: "block" 
    },
    {
      label: "Insert Image",
      style: "",
      icon: <FaImage/>,
      method: "image"
    }
];

const applyStyle = (e: MouseEvent<HTMLButtonElement>, style: string, method: string) => {
  e.preventDefault();
  if (method === 'block') {
    setEditorState(RichUtils.toggleBlockType(editorState, style));
  } else if (method === 'inline') {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  } else if (method === 'image') {
    fileInputRef.current?.click();
  }
};
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if(file){
    try {
      const downloadURL = await uploadImageToFirebase(file)
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'IMAGE',
        'IMMUTABLE',
        { src: downloadURL }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      // Insert the 'IMAGE' entity as a new atomic block in the editor
      const newEditorState = AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        ' '
      );
      setEditorState(newEditorState)
      } catch(e){
        console.log("Error handlinh image upload:", e)
      }

  }
};

const isActive = (style: string, method: string) => {
  if (method === 'block') {
    const selection = editorState.getSelection();
    const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
    return blockType === style;
  } else {
    const currentStyle = editorState.getCurrentInlineStyle();
    return currentStyle.has(style);
  }
};

return (
  <div className="toolbar-grid">
    {tools.map((item: Tool, idx: number) => (
      <Button
        className='toolbar-btn'
        style={{
          color: isActive(item.style, item.method) ? 'white' :'rgb(128,131,132)',
        }}
        key={`${item.label}-${idx}`}
        title={item.label}
        onClick={(e: MouseEvent<HTMLButtonElement>) => applyStyle(e, item.style, item.method)}
        onMouseDown={(e: MouseEvent<HTMLButtonElement>) => e.preventDefault()}
      >
        {item.icon || item.label}
      </Button>
    ))}
          <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageUpload}
          />
  </div>
);
};

export default Toolbar;
