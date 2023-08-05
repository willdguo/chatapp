import {useState} from 'react'
import supabase from '../config/supabase'


const Login = ( {setUser} ) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)

    const [newuser, setNewUser] = useState(false)

    const handleUsername = (e) => {
        setUsername(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleLogin = async (e) => {
        console.log('logging in with', username, password)

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if(error){
            setErrorMessage(error.message)

            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        } else {
            console.log(data)
            setEmail('')
            setPassword('')
            setUser(data)

            console.log('login successful')
        }
       
    }

    const handleCreateUser = async (e) => {
        console.log('creating new user', username, password)

        if(password.length < 8 || username.length < 8){
            return
        }

        const { data, error } = await supabase.auth.signUp(
            {
                email: email,
                password: password,
                options: {
                    data: {
                        username: username,
                    }
                }
            }
        )

        if(error){
            setErrorMessage(error.message)

            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)

        } else {
            console.log(data)
            setUsername('')
            setPassword('')
            setEmail('')
            setUser(data)
    
            console.log('create user successful' )
        }

    }

    const loginForm = () => {

        return(
            <div className = "login-container">
                <h2> Sign In </h2>

                <p> Email </p>
                <input value = {email} 
                    onChange = {handleEmail}
                    onKeyDown = {(e) => {if(e.key === 'Enter'){handleLogin()}}}    
                />

                <p>Password</p>
                <input value = {password} type = 'password' 
                    onChange = {handlePassword}
                    onKeyDown = {(e) => {if(e.key === 'Enter'){handleLogin()}}}
                />

                <button onClick = {handleLogin}> Submit </button>

                <p onClick = {() => setNewUser(!newuser)}> New User? </p>

                <div className = "error-msg">
                    {errorMessage}
                </div>

            </div>
        )
    }

    const newUserForm = () => (
        <div className = "login-container">
            <h2> Create Account </h2>

            <p> Username </p>
            <input className = {`create-user ${username.length < 3 ? 'short' : ''}`} value = {username} 
                onChange = {handleUsername} 
                onKeyDown = {(e) => {if(e.key === 'Enter'){handleCreateUser()}}}
            />

            <p> Email </p>
            <input 
                value = {email}
                onChange = {handleEmail}
                onKeyDown={(e) => {if(e.key === 'Enter'){handleCreateUser()}}}
            />

            <p> Password </p>
            <input className = {`create-user ${password.length < 3 ? 'short' : ''}`} value = {password} type = 'password' 
                onChange = {handlePassword} 
                onKeyDown = {(e) => {if(e.key === 'Enter'){handleCreateUser()}}}
            />

            <button onClick = {handleCreateUser}> Submit </button>

            <p onClick = {() => setNewUser(!newuser)}> Returning User? </p>

            <div className = "error-msg">
                {errorMessage}
            </div>
        </div>
    )

    return (

        <div>

            {newuser
                ? newUserForm()
                : loginForm()
            }

        </div>

    )
}

export default Login
