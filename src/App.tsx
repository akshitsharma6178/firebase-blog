import './App.css'
import { Head } from './components/header/header.tsx'
import { Home } from './components/home/home.tsx'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <>
    <Head />
    <Routes>
      <Route path="/" element={ <Home />} />
    </Routes>
    </>
  )
}

export default App
