import { useEffect, useState } from 'react';
import './sidenav.css'
import { GrHomeRounded, GrBook } from 'react-icons/gr'
import { useNavigate } from "react-router-dom";
import { LoginDialog } from '../loginDialog/loginDialog';

type Page = {
    [key: string]: string;
  };

export function Sidenav() {
    const navigate = useNavigate();
    const initalRecentPages = localStorage.getItem('recentPages') ? JSON.parse(localStorage.getItem('recentPages') as string) :  [];
    const [recentPages, setRecentPages] = useState<Page[]>(initalRecentPages);
    const [isLogin, setisLogin] = useState(false);

    useEffect(() => {
        const handleLocalStorageChange = () => {
            const updatedRecentPages = localStorage.getItem('recentPages') ? JSON.parse(localStorage.getItem('recentPages') as string) :  [];
            setRecentPages(updatedRecentPages);
        }
        window.addEventListener('recentPagesUpdate', handleLocalStorageChange)
        return ()=>{
            window.removeEventListener('recentPagesUpdate', handleLocalStorageChange)
        }
    })
    return (
        <div className="main">
            <span className='heading'>FEEDS</span>
            <div onClick={()=>navigate('/')} className='menu-tile'>
                <GrHomeRounded />
                <span className='menu-title'>Home</span>
            </div>
            <span className='heading'>RECENT</span>
            <div>
                {recentPages.length > 0 ? recentPages.map((page, index) => {
                    return (
                        <div key={index} className='menu-tile'>
                            {Object.keys(page).map((post)=> {
                                return <><GrBook /> <span onClick={()=>navigate(`/post/${post}`)} className='menu-title'>{page[post]}</span></>
                            })}
                        </div>
                        )
                }): <></>}
            </div>
            <div className='decorator sidenav-decorator'></div>
            <button  className='sidenav-btn box lgn-btn' onClick={()=>setisLogin(true)}>Join</button>
            {isLogin ? <LoginDialog setisLogin={setisLogin}/>: <></>}
        </div>
    )
}