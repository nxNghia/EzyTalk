import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useState } from 'react';

const Login = ({logIn}) => {
    const [error, setError] = useState(false)
    const [user, setUser] = useState({username: '', password: ''})
    const [haveAccount, setAccount] = useState(true)

    const style = {
        textField: {
            display: 'block',
            marginBottom: '10px',
        },

        div: {
            textAlign: 'center',
            height: '100%',
            background: 'linear-gradient(53deg, rgba(131,58,180,1) 19%, rgba(69,186,252,1) 72%)',
        },

        button: {
            margin: '20px',
        },

        form: {
            position: 'absolute',
            top: '35%',
            left: '38%',
            width: '25%',
            background: 'rgba(255, 255, 255, 0.5)',
            padding: '50px 0px 30px 0px',
            borderRadius: '10px',
        }
    }

    const registation = async () => {
        const result = await axios.post('/user/signin', user)
        if(result.data.valid)
            logIn(user)
    }

    return (
        <div style={style.div}>
            {haveAccount ? 
            <form autoComplete='off' noValidate style={style.form}>
                <TextField
                    required
                    value={user.username}
                    id='standard-basic'
                    style={style.textField}
                    onChange={(e) => setUser({...user, username: e.target.value})}
                    placeholder='username'></TextField>
                <TextField 
                    required 
                    value={user.password}
                    id='standard-basic' 
                    style={style.textField} 
                    onChange={(e) => setUser({...user, password: e.target.value})}
                    onKeyUp={(e) => {
                        if(e.key === 'Enter')
                        {
                            logIn(user)
                        }
                    }}
                    placeholder='password'
                    type='password'
                ></TextField>
                <Button style={style.button} variant='contained' color='primary' onClick={(e) => {
                    e.preventDefault()
                    logIn(user)
                }}>Log in</Button>
                <Button style={style.button} variant='contained' color='primary' onClick={(e) => {
                    e.preventDefault()
                    setUser({username: '', password: ''})
                    setAccount(false)
                }}>Register</Button>
            </form> :
            <form autoComplete='off' noValidate style={style.form}>
                <TextField 
                    required
                    value={user.username} 
                    id='standard-basic' 
                    style={style.textField} 
                    onChange={(e) => setUser(user => ({...user, username: e.target.value}))} 
                    placeholder='username'
                ></TextField>
                <TextField 
                    required 
                    value={user.password}
                    id='standard-basic' 
                    style={style.textField} 
                    type='password'
                    onChange={(e) => setUser(user => ({...user, password: e.target.value}))} 
                    placeholder='password'
                ></TextField>
                <TextField 
                    required
                    error={error}
                    id={error ? 'standard-error-helper-text' : 'standard-basic'}
                    style={style.textField} 
                    type='password'
                    onChange={(e) => {
                        setError(e.target.value !== user.password)
                    }} 
                    onKeyUp={(e) => {
                        if(e.key === 'Enter')
                        {
                            registation()
                        }
                    }}
                    placeholder='confirm password'
                ></TextField>
                <Button style={style.button} variant='contained' color='primary' onClick={(e) => {
                    e.preventDefault()
                    registation()
                }}>Done</Button>
                <Button style={style.button} variant='contained' color='primary' onClick={(e) => {
                    e.preventDefault()
                    setUser({username: '', password: ''})
                    setAccount(true)
                }}>Back</Button>
            </form>
            }
        </div>
    )
}

export default Login