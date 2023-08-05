import { useState } from 'react'
import Login from './components/Login'

function App() {

  const [user, setUser] = useState(null)

  const logout = () => {
    setUser(null)
  }

  const main = () => (
    <div>
      <h1> Hello, {user.user.user_metadata.username} </h1>
      <button onClick = {logout}> Logout </button>
    </div>
  )

  return (
    <div className = "main">
      
      {user === null
      ? <Login user = {user} setUser = {setUser} />
      : main()
      }

    </div>
  )

}

export default App;
