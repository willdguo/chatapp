import { useState, useEffect } from 'react'
import supabase from '../config/supabase'
 
const RoomHistory = ({user}) => {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [room, setRoom] = useState(user.user.user_metadata.username)
    const [newRoom, setNewRoom] = useState('')

    const channel = supabase.channel(room)

    useEffect(() => {
      channel
      // .on(
      //   'presence',
      //   { event: 'sync' },
      //   () => {
      //     const newState = channel.presenceState()
      //     console.log('sync', newState)
      //   }
      // )
      .on(
        'presence',
        { event: 'join' },
        ({ key, newPresences }) => {
          console.log('join', key, newPresences)
        }
      )
      .on(
        'presence',
        { event: 'leave' },
        ({ key, leftPresences }) => {
          console.log('leave', key, leftPresences)
        }
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const presenceTrackStatus = await channel.track({
            user: user,
            online_at: new Date().toISOString(),
          })
          console.log(presenceTrackStatus)
        }
      })
    })
    
    
    useEffect(() => {

      const getMessages = async () => {
        let { data, error } = await supabase
          .from('messages')
          .select('*')

          if(error){
            console.log(error)
          } else {
            setMessages(data)
            console.log("retrieved messages")
          }
      }
      
      getMessages()
    }, [])

    const handleInput = (e) => {
      setInput(e.target.value)
    }

    const sendInput = async () => {

      if(input.trim()){
        
        const { data, error } = await supabase
          .from('messages')
          .insert([
            { message: input, sender: user.user.user_metadata.username, room: room },
          ])
          .select()
        
          if(error){
            console.log(error)
          } else {
            const newMessage = data[0]
            console.log(newMessage)
            setMessages(messages.concat(newMessage))
            setInput('')
          }

      }
  
    }

    return (
      
      <div className = {`history-content`}>
        <div>
          <input 
            placeholder = "Join Room"
            value = {newRoom}
            onChange = {(e) => setNewRoom(e.target.value)}
            onKeyDown = {(e) => {if(e.key === "Enter"){setRoom(newRoom); setNewRoom(''); console.log(`joined ${newRoom}`)}}}
          />
        </div>

        {messages.slice().reverse().map(message => (
          <div key = {Math.floor(Math.random() * 100000)}>
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

export default RoomHistory