import {useState} from 'react'
import {
    Routes, Route, Link, useNavigate, Navigate
  } from 'react-router-dom'
import loginService from '../services/login'
import userService from '../services/user'


const Login = ( {user, setUser, setRoom, setPastRooms}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)

    const navigate = useNavigate()


    const handleUsername = (e) => {
        setUsername(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleLogin = async (e) => {
        console.log('logging in with', username, password)

        try {
            const user = await loginService.login({ username, password })

            setUser(user)
            setRoom(user.username)
            setUsername('')
            setPassword('')

            console.log('success')

            window.localStorage.setItem('loggedUser', JSON.stringify(user))
            window.localStorage.setItem('loggedRoom', user.username)

            setErrorMessage(`Welcome, ${username}`)
            navigate(`/room/${username}`)

            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)

        } catch (error) {
            setErrorMessage('Incorrect username/password')

            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)

        }
    }

    const handleCreateUser = async (e) => {
        console.log('creating new user', username, password)

        try {
            let newuser = await userService.addUser({username, password}) 
            console.log('created: ')
            console.log(newuser)
            newuser = await loginService.login({username, password})

            // console.log('logged in: ')
            // console.log(newuser)

            setUser(newuser)
            setUsername('')
            setPassword('')

            console.log('success')

            window.localStorage.setItem('loggedUser', JSON.stringify(newuser))
        } catch (error) {
            console.log(error.response.data.error)

            if(error.response.data.error === 'username already in use'){
                setErrorMessage('Username already in use')
            } else {
                setErrorMessage('Username must be at least 3 characters & password must be at least 8 characters')
            }

            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }

    }

    const logout = () => {
        navigate('/login')
        window.localStorage.clear()

        setErrorMessage('Adios')
        setUser(null)
        setRoom(null)
        setPastRooms([])

        setTimeout(() => {
            setErrorMessage(null)
        }, 5000)
    }

    const loginForm = () => (

        <div className = "login-container">
            <h2> Sign In </h2>

            <p> Username </p>
            <input value = {username} 
                onChange = {handleUsername}
                onKeyDown = {(e) => {if(e.key === 'Enter'){handleLogin()}}}    
            />

            <p>Password</p>
            <input value = {password} type = 'password' 
                onChange = {handlePassword}
                onKeyDown = {(e) => {if(e.key === 'Enter'){handleLogin()}}}
            />

            <button onClick = {handleLogin}> Submit </button>

            <Link to = "/newuser"> newuser </Link>

            <div className = "error-msg">
                {errorMessage}
            </div>

        </div>
    )

    const newUserForm = () => (
        <div className = "login-container">
            <h2> Create Account </h2>

            <p> Username </p>
            <input className = {`create-user ${username.length < 3 ? 'short' : ''}`} value = {username} 
                onChange = {handleUsername} 
                onKeyDown = {(e) => {if(e.key === 'Enter'){handleCreateUser()}}}
            />

            <p> Password </p>
            <input className = {`create-user ${password.length < 3 ? 'short' : ''}`} value = {password} type = 'password' 
                onChange = {handlePassword} 
                onKeyDown = {(e) => {if(e.key === 'Enter'){handleCreateUser()}}}
            />

            <button onClick = {handleCreateUser}> Submit </button>

            <Link to = "/login"> login </Link>

            <div className = "error-msg">
                {errorMessage}
            </div>
        </div>
    )

    const validUser = () => (
        <div>
            <p> Hello, {user.username} </p>
            <button onClick = {logout}> Logout </button>
        </div>
    )

    return (

        <div>

            <Routes>
                <Route path = "/newuser" element = {newUserForm()}/>
                <Route path = "/login" element = {loginForm()}/>
                <Route path = "/" element = {<Navigate replace to="/login" />}/>
                <Route path = "/room/:id" element = {user !== null ? validUser() : <Navigate replace to = {`/login`} />} />
            </Routes>

        </div>



    )
}

export default Login
