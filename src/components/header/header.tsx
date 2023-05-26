import { useState } from 'react';
import './header.css'
// import { useNavigate} from 'react-router-dom'
export function Head() {
    // const navigate = useNavigate();
    const [isLogin, setisLogin] = useState(false);
    return (
        <>
        <div className='mainHead'>
            <button onClick={()=> setisLogin(!isLogin)}>Login</button>
            {isLogin ?(
             <dialog open>
                <form method="dialog">
                    <label htmlFor="email">Email</label>
                    <input type="email" name='email' />
                    <label htmlFor="password">Password</label>
                    <input type="password" name='password' />
                </form>
             </dialog>): <></>}
        </div>
        </>
    )
}