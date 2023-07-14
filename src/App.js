import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Login from './components/Login'
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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')

    if(loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      setUser(savedUser)
      socket.emit("join_room", {roomId: savedUser.username})
      setRoom(savedUser.username)

      // setMessages(messages.concat({content: `Welcome, ${savedUser.username}`}))
    }

  }, [])

  useEffect(() => {
    roomService.getRoom(room)
      .then(roomHistory => {
        console.log(roomHistory)

        if(room !== null && roomHistory !== null){
          setMessages(roomHistory.messages)
          // console.log(roomHistory, "asdfasdf")
        } else {
          setMessages([])
        }

      })

  }, [room])

  useEffect(() => {
    socket.on("receive_message", (data) => {
      // console.log(data)
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

    if(!pastRooms.includes(k)){
      setPastRooms(pastRooms.concat(k))

      const prev = await roomService.getRoom(room)

      if(prev === null){
        await roomService.addRoom({title: roomId})
      }

    }

  }

  const handleInput = (e) => {
    setInput(e.target.value)
  }


  return (

    <div className = {`main`}>

      <h2> Chat Room </h2>

      <Login user = {user} setUser = {setUser} />

      <div className = {`roomId`}>
        <input placeholder = "Join Room" value = {roomId} 
          onChange = {(e) => setRoomId(e.target.value)} 
          onKeyDown = {(e) => {if(e.key === 'Enter'){joinRoom()}}}
        />

        <i> {room === null ? null: `Joined room ${room}`} </i>

        <button onClick = {() => joinRoom(user.username)}> Home </button>
      </div>

      <div className = {`conversations`}>
        {pastRooms.map(pastRoom => (
          <button key = {Math.floor(Math.random() * 100000)} onClick = {() => joinRoom(pastRoom)}> Join {pastRoom} </button>
        ))}
      </div>

      <div className = {`history-content`}>
        {messages.slice().reverse().map(message => (
          <div key = {Math.floor(Math.random() * 100000)} className = {`message-container ${message.sender === user.username ? 'local' : (message.sender !== null ? 'foreign' : 'notif')}`}>
            <div className = {`sender`}>
              {message.sender}
            </div>
            {message.message}
          </div>
        ))}
      </div>


      <div className = {`message-box`}>
        <input placeholder="Message" value = {input} onChange = {handleInput} onKeyDown = {(e) => {if(e.key === 'Enter'){sendInput()}}}/>
        <button onClick = {sendInput}> {'>>'} </button>
      </div>
  
    </div>

  )

}

export default App;
