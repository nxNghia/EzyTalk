import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import PersonIcon from '@material-ui/icons/Person';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useState } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import Intro from '../Intro/Intro'
import { useMediaQuery } from 'react-responsive';

const Login = ({logIn, invalid, errorToggle}) => {
    const [error, setError] = useState(false)
    const [user, setUser] = useState({username: '', password: ''})
    const [haveAccount, setAccount] = useState(true)
    const [hover, setHover] = useState(false)

    const limit = useMediaQuery({maxWidth: 1300})

    const style = {
        textField: {
            display: 'block',
            marginBottom: '20px',
        },

        div: {
            position: 'relative',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(88,63,243,1) 0%, rgba(255,77,0,0.7962535355939251) 100%)',
        },

        button: {
            width: '100%',
            background: '#000000',
            color: '#ffffff',
            height: '3em',
            marginBottom: '1em'
        },

        loginForm: {
            width: '350px',
            overflow: 'hidden',
            background: '#ffffff',
            padding: '50px 0px 30px 0px',
            borderRadius: '10px',
            height: '450px',
            maxWidth: haveAccount ? '350px' : 0,
            transition: 'max-width 200ms'
        },

        signupForm: {
            width: '350px',
            overflow: 'hidden',
            background: '#ffffff',
            padding: '50px 0px 30px 0px',
            borderRadius: '10px',
            height: '450px',
            maxWidth: haveAccount ? 0 : '350px',
            transition: 'max-width 200ms',
        },

        header: {
            fontWeight: 'bold',
            fontSize: '40px',
            marginBottom: '1.5em',
            fontFamily: 'Roboto'
        },

        createAccount: {
            fontWeight: 'bold',
            cursor: 'pointer',
            color: hover ? '#555555' : '#000000',
            transition: 'color 300ms'
        },

        buttons: {
            display: 'flex',
            flexDirection: 'column',
            margin: 'auto',
            width: '50%',
            paddingTop: '2em',
            marginBottom: '4em'
        },

        forms: {
            textAlign: 'center',
            position: 'absolute',
            right: limit ? 0 : '10em',
            left: limit ? 0 : 'auto',
            margin: 'auto',
            top: '5em',
            display: 'flex',
            justifyContent: 'center'
        },

        alert: {
            color: '#ff0000',
            opacity: invalid ? 1 : 0,
            transition: 'opacity 250ms'
        }
    }

    const registation = async () => {
        const result = await axios.post('/user/signin', user)
        if(result.data.valid)
            logIn(user)
    }

    return (
        <div style={style.div}>
            <Intro />
            <div style={style.forms}>
                <form autoComplete='off' noValidate style={style.loginForm}>
                    <h1 style={style.header}>LOGIN</h1>
                    <TextField
                        required
                        value={user.username}
                        id='input-with-icon-textfield'
                        style={style.textField}
                        onChange={(e) => setUser({...user, username: e.target.value})}
                        placeholder='username'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                        }}    
                    ></TextField>

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
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon />
                                </InputAdornment>
                            )
                        }}
                    ></TextField>
                    <h4 style={style.alert}>Something went wrong</h4>
                    <div style={style.buttons}>
                        <Button style={style.button} variant='contained' color='primary' onClick={(e) => {
                            e.preventDefault()
                            logIn(user)
                        }}>Log in</Button>
                    </div>

                    <p style={style.createAccount}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        onClick={e => {
                            e.preventDefault()
                            setUser({username: '', password: ''})
                            setAccount(false)
                            errorToggle(false)
                        }}
                    >Create account ?</p>
                </form>
                <form autoComplete='off' noValidate style={style.signupForm}>
                    <h1 style={style.header}>Create account</h1>
                    <TextField 
                        required
                        value={user.username} 
                        id='standard-basic' 
                        style={style.textField} 
                        onChange={(e) => setUser(user => ({...user, username: e.target.value}))} 
                        placeholder='username'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                        }} 
                    ></TextField>

                    <TextField 
                        required 
                        value={user.password}
                        id='standard-basic' 
                        style={style.textField} 
                        type='password'
                        onChange={(e) => setUser(user => ({...user, password: e.target.value}))} 
                        placeholder='password'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon />
                                </InputAdornment>
                            )
                        }}
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
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon />
                                </InputAdornment>
                            )
                        }}
                    ></TextField>
                    <div style={style.buttons}>
                    <Button style={style.button} variant='contained' color='primary' onClick={(e) => {
                        e.preventDefault()
                        registation()
                    }}>Done</Button>
                    <Button style={{background: '#ffffff', color: '#000000', border: '3px solid black'}} variant='contained' color='primary' onClick={(e) => {
                        e.preventDefault()
                        setUser({username: '', password: ''})
                        setAccount(true)
                        errorToggle(false)
                    }}>Back</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login