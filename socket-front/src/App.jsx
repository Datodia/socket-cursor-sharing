import { useEffect, useState } from 'react'
import './App.css'
import io from 'socket.io-client'

const socket = io(import.meta.env.VITE_WS_URL)

function App() {  
  const [clients, setClients] = useState({})
  function getCoordinates(e){
    socket.emit('mouseCoordinate', {
      x: e.clientX,
      y: e.clientY
    })
  }

  useEffect(() => {
    window.addEventListener('mousemove', getCoordinates)

    return () => {
      window.removeEventListener('mousemove', getCoordinates)
    }
  }, [])

  const generateCursor = () => {
    return Object.keys(clients).map((key, index) => {
      return <div key={index} style={{width: 20, height: 20, background: 'red', position: 'absolute', top: `${clients[key].y}px`, left: `${clients[key].x}px`}}></div>
    })
  }

  useEffect(() => {
    socket.on('onMouseMove', data => {
      setClients(data)
    })

    return () => {
      socket.off('onMouseMove')
    }
  }, [])

  return (
    <>
      {generateCursor()}
    </>
  )
}

export default App
