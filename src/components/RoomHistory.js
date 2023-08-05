import { useState, useEffect } from 'react'
import {
  useNavigate, useParams
} from 'react-router-dom' 
 

const RoomHistory = ({user, messages, setRoom, setMessages}) => {
    const [input, setInput] = useState('')

    // const testid = useParams().id
    const urlRoom = useParams().id
    const navigate = useNavigate()

    useEffect(() => {
      console.log("in room history")

      if(user === null){
        setRoom(null)
        return
      }

      if(urlRoom !== null){
        console.log(`room from url: ${urlRoom}`)
        setRoom(urlRoom)
      } else {
        const loggedRoom = window.localStorage.getItem('loggedRoom')

        if(loggedRoom) {
          console.log("shit logged room")
          setRoom(loggedRoom)
          navigate(`/room/${loggedRoom}`)
        }

      }

    }, [user])

    const handleInput = (e) => {
      setInput(e.target.value)
    }

    const sendInput = async () => {

      if(input.trim()){
        const newMessage = {message: input, sender: user.username}
        setMessages(messages.concat(newMessage))
        setInput('')
      }
  
    }

    if(user !== null){
      return (
        <div className = {`history-content`}>
          {messages.slice().reverse().map(message => (
            <div key = {Math.floor(Math.random() * 100000)} className = {`message-container ${message.sender === user.username ? 'local' : (message.sender !== null ? 'foreign' : 'notif')}`}>
              <div className = {`sender`}>
                {message.sender}
              </div>
              {message.message}
            </div>
          ))}


          <div className = {`message-box`}>
            <input placeholder="Message" value = {input} onChange = {handleInput} onKeyDown = {(e) => {if(e.key === 'Enter'){sendInput()}}}/>
            <button onClick = {sendInput}> {'>>'} </button>
          </div>
        </div>
      )
    }

}

export default RoomHistory