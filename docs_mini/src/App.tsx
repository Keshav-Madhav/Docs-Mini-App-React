import React from "react"
import Background from "./components/Background"
import Foreground from "./components/Foreground"
import { Toaster } from "sonner"

const App = () => {
  return (
    <div className='relative w-full h-screen bg-zinc-800'>
      <Toaster expand richColors position="top-right" closeButton/>

      <Background />

      <Foreground/>
    </div>
  )
}

export default App