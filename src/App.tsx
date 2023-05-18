import './App.css'
import { Head } from './components/header/header.tsx'
import { Home } from './components/home/home.tsx'
import { Route, Routes } from 'react-router-dom'
import { NewPost } from './components/newPost/newPost.tsx'

function App() {
  return (
    <>
    <Head />
    <Routes>
      <Route path="/" element={ <Home />} />
      <Route path="/new" element={ <NewPost />} />
    </Routes>
    </>
  )
}

export default App
