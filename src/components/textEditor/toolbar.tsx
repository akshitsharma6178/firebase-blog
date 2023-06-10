import { Button } from '@mui/material';
import { EditorState, RichUtils } from 'draft-js';
import { ReactNode, MouseEvent } from 'react';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaTextWidth,
  FaListUl,
  FaListOl,
} from 'react-icons/fa';

interface Tool {
  label: string;
  style: string;
  icon?: ReactNode;
  method: string;
}

interface ToolbarProps {
  editorState: EditorState;
  setEditorState: (state: EditorState) => void;
}

const Toolbar = ({ editorState, setEditorState }: ToolbarProps) => {
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
      label: "underline",
      style: "UNDERLINE",
      icon: <FaUnderline />,
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
    }
];

const applyStyle = (e: MouseEvent<HTMLButtonElement>, style: string, method: string) => {
  e.preventDefault();
  method === 'block'
    ? setEditorState(RichUtils.toggleBlockType(editorState, style))
    : setEditorState(RichUtils.toggleInlineStyle(editorState, style));
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
  </div>
);
};

export default Toolbar;
