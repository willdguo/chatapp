import { useState, useEffect } from 'react'
import {
  useNavigate, useParams
} from 'react-router-dom' 
 

const RoomHistory = ({user, messages, setRoom, socket}) => {
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
        socket.emit("join_room", {roomId: urlRoom})
      } else {
        const loggedRoom = window.localStorage.getItem('loggedRoom')

        if(loggedRoom) {
          console.log("shit logged room")
          setRoom(loggedRoom)
          socket.emit("join_room", {roomId: loggedRoom})
          navigate(`/room/${loggedRoom}`)
        }

      }

    }, [user])

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
        </div>
      )
    }

}

export default RoomHistory