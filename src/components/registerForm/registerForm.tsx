import { useState } from "react";
import { registerUserWithEmailAndPassword } from "../../services/firebase";

interface loginformProps {
    btntext: string,
    onSubmit: () => void
}

export function RegisterForm( props: loginformProps) {

    const [isActiveMail, setActiveMail] = useState(false);
    const [emailValue, setEmailValue] = useState('');
    const [passValue, setPassValue] = useState('');
    const [isActivePass, setActivePass] = useState(false);
    const [unameValue, setUnameValue] = useState('');
    const [isActiveuname, setActiveuname] = useState(false);
    const [isNextStep, setNextStep] = useState(false);

    const isEmailValid = (email: string) => {
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };
    
      const handleContinue = () => {
        if (isEmailValid(emailValue)) {
          // Perform action when email is valid
          // For example, navigate to the next step
          setNextStep(!isNextStep);
        } else {
          console.error("Invalid Email")
        }
      };

      function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        registerUserWithEmailAndPassword(unameValue, emailValue, passValue)
      }
    return(
    <form method="dialog" onSubmit={handleSubmit}>
        { !isNextStep?
        (<>
            <div className={`inp-block ${isActiveMail || emailValue? 'active' : ''} ${isActiveMail? 'border-show': ''}`}>
                <label className="box-label" htmlFor="email">Email</label>
                <input value={emailValue} className="box inp" onChange={(event)=> setEmailValue(event.target.value)} onFocus={()=>setActiveMail(true)} onBlur={()=>setActiveMail(false)} type="email" name='email' />
            </div>
            <button disabled={!isEmailValid(emailValue)} className='box lgn-btn' onClick={handleContinue}>Continue</button>
        </>): 
        (<>
            <div className={`inp-block ${isActiveuname || unameValue? 'active' : ''} ${isActiveuname? 'border-show': ''}`}>
                <label className="box-label" htmlFor="uname">Username</label>
                <input value={unameValue} className="box inp" onChange={(event)=> setUnameValue(event.target.value)} onFocus={()=>setActiveuname(true)} onBlur={()=>setActiveuname(false)} type="input" name='uname' />
            </div>
                <div className={`inp-block ${isActivePass || passValue? 'active' : ''} ${isActivePass? 'border-show': ''}`}>
                <label className="box-label" htmlFor="password">Password</label>
                <input value={passValue} className="box inp" onChange={(event)=> setPassValue(event.target.value)} onFocus={()=>setActivePass(true)} onBlur={()=>setActivePass(false)} type="password" name='password' />
            </div> 
            <button className='box lgn-btn' type='submit'>{props.btntext}</button>
        </>)}
    </form>
    )
}