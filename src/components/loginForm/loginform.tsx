import { useState } from "react";
import { logInWithEmailAndPassword } from "../../services/firebase";

interface loginformProps {
    btntext: string,
    onSubmit: () => void
}

export function LoginForm( props: loginformProps) {

    const [isActiveMail, setActiveMail] = useState(false);
    const [emailValue, setEmailValue] = useState('');
    const [passValue, setPassValue] = useState('');
    const [isActivePass, setActivePass] = useState(false);
    
    function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        logInWithEmailAndPassword(emailValue,passValue)
      }

    return (
        <form method="dialog" onSubmit={handleSubmit}>
            <div className={`inp-block ${isActiveMail || emailValue? 'active' : ''} ${isActiveMail? 'border-show': ''}`}>
                <label className="box-label" htmlFor="email">Email</label>
                <input value={emailValue} className="box inp" onChange={(event)=> setEmailValue(event.target.value)} onFocus={()=>setActiveMail(true)} onBlur={()=>setActiveMail(false)} type="email" name='email' />
            </div>
            <div className={`inp-block ${isActivePass || passValue? 'active' : ''} ${isActivePass? 'border-show': ''}`}>
                <label className="box-label" htmlFor="password">Password</label>
                <input value={passValue} className="box inp" onChange={(event)=> setPassValue(event.target.value)} onFocus={()=>setActivePass(true)} onBlur={()=>setActivePass(false)} type="password" name='password' />
            </div>
            <button className='box lgn-btn' type='submit'>{props.btntext}</button>
        </form>
    )
}