import { useEffect, useState } from 'react';
import './sidenav.css'
import { GrHomeRounded, GrBook } from 'react-icons/gr'
import { useNavigate } from "react-router-dom";
import { LoginDialog } from '../loginDialog/loginDialog';
import { auth } from '../../services/firebase';
import { User } from 'firebase/auth';

type Page = {
    [key: string]: string;
  };

interface sidenavPropStruct {
    className: string
}

export function Sidenav( props: sidenavPropStruct) {
    const navigate = useNavigate();
    const initalRecentPages = localStorage.getItem('recentPages') ? JSON.parse(localStorage.getItem('recentPages') as string) :  [];
    const [recentPages, setRecentPages] = useState<Page[]>(initalRecentPages);
    const [isLogin, setisLogin] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const handleLocalStorageChange = () => {
            const updatedRecentPages = localStorage.getItem('recentPages') ? JSON.parse(localStorage.getItem('recentPages') as string) :  [];
            setRecentPages(updatedRecentPages);
        }
        window.addEventListener('recentPagesUpdate', handleLocalStorageChange)
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
          });
      
        return ()=>{
            window.removeEventListener('recentPagesUpdate', handleLocalStorageChange)
            unsubscribe()
        }
    })
    return (
        <div className={`main ${props.className}`}>
            <span className='heading'>FEEDS</span>
            <div onClick={()=>navigate('/')} className='menu-tile'>
                <GrHomeRounded />
                <span className='menu-title'>Home</span>
            </div>
            <span className='heading'>RECENT</span>
            <div className='sidenav-recent'>
                {recentPages.length > 0 ? recentPages.map((page, index) => {
                    return (
                        <div key={index} className='menu-tile'>
                            {Object.keys(page).map((post)=> {
                                return <div  key={post}><GrBook /> <span onClick={()=>navigate(`/post/${post}`)} className='menu-title'>{page[post]}</span></div>
                            })}
                        </div>
                        )
                }): <></>}
            </div>
            <div className='decorator sidenav-decorator'></div>
            { !auth.currentUser || !user? <><button  className='sidenav-btn box lgn-btn' onClick={()=>setisLogin(true)}>Join</button>
            {isLogin ? <LoginDialog setisLogin={setisLogin}/>: <></>
             }</> : <></>}
        </div>
    )
}