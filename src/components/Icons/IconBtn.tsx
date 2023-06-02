import { useState } from "react";
import { LoginDialog } from "../loginDialog/loginDialog";

interface IconProps {
    im: React.ComponentType,
    isactive?: number,
    color?: string,
    children?: unknown,
    onClick?: ()=>void,
    closeBtn?: boolean,
    disabled?: boolean
}

export function IconBtn(props: IconProps) {
  const [isLogin, setisLogin] = useState(false);
    return (
      <>
      <button
        className={`btn icon-btn ${props.isactive ? "icon-btn-active" : ""} ${props.closeBtn? 'close-btn' : "" } ${
          props.color || ""
        }`}
        onClick={!props.disabled? props.onClick : () => setisLogin(true)}
      >
        <span className={`${props.children != null ? "mr-1" : ""} ${props.closeBtn? 'close-btn' : "" }`}>
          <props.im />
        </span>
        {props.children as string}
      </button>
       {isLogin ? <LoginDialog setisLogin={setisLogin}/>: <></>}
       </>
    )
  }