import { GrClose } from "react-icons/gr";
import { IconBtn } from "../Icons/IconBtn";
import { logInwithGoogle } from "../../services/firebase";
import { FaGoogle } from "react-icons/fa";
import { LoginForm } from "../loginForm/loginform";
import { RegisterForm } from "../registerForm/registerForm";
import { useState } from "react";

interface dialogPropStructure {
    setisLogin: (value: boolean) => void
}

export function LoginDialog(props: dialogPropStructure) {
    const [isRegister, setisRegister] = useState(false);
    return (
        <>
         <div className='overlay'></div>
         <dialog className="fullscreen-dialog" open>
            <div className='top-section'>
                <div className='close-btn'>
                    <IconBtn 
                    im={GrClose}
                    onClick={()=>{props.setisLogin(false); setisRegister(false)}}
                    color='lightgray'
                    closeBtn={true}
                    />
                </div>
                <p className='title-lgn'>Log in</p>
            </div>
            <div className='brand-lgn'>
                <button onClick={logInwithGoogle}className='box brand-box'><FaGoogle /><span className="lgn-gtn-brand">Continue with Google</span></button>
                {/* <button className='box brand-box'><FaApple /><span className="lgn-gtn-brand">Continue with Apple</span></button> */}
            </div>
            <div className='decorator'><div className='decorator-text'>OR</div></div>
            {
                isRegister?
                <RegisterForm 
                    btntext='Register'
                    onSubmit={() => props.setisLogin(false)}
                /> :
                <LoginForm 
                    btntext="Log in"
                    onSubmit={() => props.setisLogin(false)}
                />
            }
            <div className='register'>
                {
                    isRegister?
                    <>
                        <span>Already been here?</span> <span className='link' onClick={()=>setisRegister(false)}>Log in</span>
                    </>:
                    <>
                        <span>New here?</span> <span className='link' onClick={()=>setisRegister(true)}>Sign Up</span>
                    </>
                }
            </div>
         </dialog>
         </>)
}