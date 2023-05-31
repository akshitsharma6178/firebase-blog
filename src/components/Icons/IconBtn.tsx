interface IconProps {
    im: React.ComponentType,
    isactive?: number,
    color?: string,
    children?: unknown,
    onClick?: ()=>void,
    closeBtn?: boolean
}

export function IconBtn(props: IconProps) {
    return (
      <button
        className={`btn icon-btn ${props.isactive ? "icon-btn-active" : ""} ${props.closeBtn? 'close-btn' : "" } ${
          props.color || ""
        }`}
        onClick={props.onClick}
      >
        <span className={`${props.children != null ? "mr-1" : ""} ${props.closeBtn? 'close-btn' : "" }`}>
          <props.im />
        </span>
        {props.children as string}
      </button>
    )
  }