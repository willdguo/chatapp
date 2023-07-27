import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import {
  Routes, Route, useNavigate
} from 'react-router-dom'
import Login from './components/Login'
import RoomHistory from './components/RoomHistory'
import roomService from './services/room'

const socket = io.connect("http://localhost:3001")

// inspiration: https://www.youtube.com/watch?v=-SpWOpdzUKw

function App() {

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [roomId, setRoomId] = useState('')
  const [room, setRoom] = useState(null)
  const [pastRooms, setPastRooms] = useState([])

  const [user, setUser] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    // const loggedRoom = window.localStorage.getItem('loggedRoom') // Move to RoomHistory

    if(loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      setUser(savedUser)
    }

  }, [])

  useEffect(() => {
    roomService.getRoom(room)
      .then(roomHistory => {
        console.log(roomHistory)

        if(room !== null && roomHistory !== null){
          setMessages(roomHistory.messages)
        } else {
          setMessages([])
        }

      })

  }, [room])

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages(messages.concat({message: data.message, sender: data.sender}))
    })
  }, [messages])

  const sendInput = async () => {

    if(input.trim()){
      const newMessage = {message: input, sender: user.username}
      setMessages(messages.concat(newMessage))
      socket.emit("send_message", {...newMessage, room: room})

      await roomService.addMessage(room, newMessage)

      setInput('')
    }

  }

  const joinRoom = async (k = roomId) => {

    socket.emit("leave_room", {roomId: room})
    socket.emit("join_room", {roomId: k})
    setRoom(k)
    navigate(`/room/${k}`)
    window.localStorage.setItem('loggedRoom', k)

    if(!pastRooms.includes(k)){
      setPastRooms(pastRooms.concat(k))

      const prev = await roomService.getRoom(k)

      console.log(prev)

      if(prev === null){
        await roomService.addRoom({title: k})
      }

    }

  }

  const handleInput = (e) => {
    setInput(e.target.value)
  }

  return (

    <div className = {`main`}>

      <h2> Chat Room </h2>

      <Login user = {user} setUser = {setUser} room = {room} setRoom = {setRoom} setPastRooms = {setPastRooms} />

      <div className = {`roomId`}>
        <input placeholder = "Join Room" value = {roomId} 
          onChange = {(e) => setRoomId(e.target.value)} 
          onKeyDown = {(e) => {if(e.key === 'Enter'){joinRoom()}}}
        />

        <i> {room === null ? null: `Joined room ${room}`} </i>

        <button onClick = {user !== null ? () => joinRoom(user.username) : null}> Home </button>
      </div>

      <div className = {`conversations`}>
        {pastRooms.map(pastRoom => (
          <button key = {Math.floor(Math.random() * 100000)} onClick = {() => joinRoom(pastRoom)}> Join {pastRoom} </button>
        ))}
      </div>
      

      <Routes>
        <Route path = "/room/:id" element = {<RoomHistory user = {user} messages = {messages} setRoom = {setRoom} socket = {socket}/>} />
      </Routes>


      <div className = {`message-box`}>
        <input placeholder="Message" value = {input} onChange = {handleInput} onKeyDown = {(e) => {if(e.key === 'Enter'){sendInput()}}}/>
        <button onClick = {sendInput}> {'>>'} </button>
      </div>
  
    </div>

  )

}

export default App;
