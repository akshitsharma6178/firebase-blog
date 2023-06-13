import { ContentBlock, ContentState } from 'draft-js';

interface ImageComponentProps {
  contentState: ContentState;
  block: ContentBlock;
}

export function ImageComponent(props : ImageComponentProps) {
    const { src } = props.contentState.getEntity(props.block.getEntityAt(0)).getData();
    return <img className="image-preview" src={src} alt="Embedded Image" />
}