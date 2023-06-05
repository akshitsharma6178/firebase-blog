import './App.css'
import { Head } from './components/header/header.tsx'
import { Home } from './components/home/home.tsx'
import { Route, Routes } from 'react-router-dom'
import { NewPost } from './components/newPost/newPost.tsx'
import { IndividualPost } from './components/individualPost/individualPost.tsx'
import { Sidenav } from './components/sidenav-home/sidenav.tsx'
// import { auth, logInWithToken } from './services/firebase.ts'
// import { useEffect, useState } from 'react'
// import { User } from 'firebase/auth'

function App() {

  // const token = localStorage.getItem('authToken')
  // token? logInWithToken(token): null;
  // const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   const checkAuthState = () => {
  //     const user = auth.currentUser;
  //     setUser(user)
  //   }
  //   checkAuthState();
  // })
  return (
    <>
    <div className='main-container'>
      <Head 
      className='header-grid'/>
      <Sidenav 
      className='sidenav-grid'/>
      <Routes>
        <Route path="/" element={ <Home/>} />
        <Route path="/new" element={ <NewPost/>} />
        <Route path="/post/:postId" element={ <IndividualPost/>} />
      </Routes>
    </div>
    </>
  )
}

export default App
