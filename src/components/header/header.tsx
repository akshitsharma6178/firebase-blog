import { useState } from 'react';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { GrClose } from 'react-icons/gr'
import './header.css'
import { IconBtn } from '../Icons/IconBtn';
// import { useNavigate} from 'react-router-dom'
export function Head() {
    // const navigate = useNavigate();
    const [isLogin, setisLogin] = useState(false);
    const [isActiveMail, setActiveMail] = useState(false);
    const [emailValue, setEmailValue] = useState('');
    const [passValue, setPassValue] = useState('');
    const [isActivePass, setActivePass] = useState(false);
    return (
        <>
        <div className='mainHead'>
            <button className="lgn-btn-main" onClick={()=> setisLogin(true)}>Log in</button>
            {isLogin ?(
            <>
             <div className='overlay'></div>
             <dialog className="fullscreen-dialog" open>
                <div className='top-section'>
                    <div className='close-btn'>
                        <IconBtn 
                        im={GrClose}
                        onClick={()=>setisLogin(false)}
                        color='lightgray'
                        closeBtn={true}
                        />
                    </div>
                    <p className='title-lgn'>Log in</p>
                </div>
                <div className='brand-lgn'>
                    <button className='box brand-box'><FaGoogle /><span className="lgn-gtn-brand">Continue with Google</span></button>
                    <button className='box brand-box'><FaApple /><span className="lgn-gtn-brand">Continue with Apple</span></button>
                </div>
                <div className='decorator'></div>
                <form method="dialog">
                    <div className={isActiveMail || emailValue? 'inp-block active' : 'inp-block'}>
                        <label className="box-label" htmlFor="email">Email</label>
                        <input value={emailValue} className="box inp" onChange={(event)=> setEmailValue(event.target.value)} onFocus={()=>setActiveMail(true)} onBlur={()=>setActiveMail(false)} type="email" name='email' />
                    </div>
                    <div className={isActivePass || passValue? 'inp-block active' : 'inp-block'}>
                        <label className="box-label" htmlFor="password">Password</label>
                        <input value={passValue} className="box inp" onChange={(event)=> setPassValue(event.target.value)} onFocus={()=>setActivePass(true)} onBlur={()=>setActivePass(false)} type="password" name='password' />
                    </div>
                    <button className='box lgn-btn' type='submit'>Log in</button>
                </form>
             </dialog>
             </>): <></>}
        </div>
        </>
    )
}