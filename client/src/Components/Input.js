import SendIcon from '@material-ui/icons/Send';
import { useState } from 'react';
import Cookies from 'js-cookie';

const Input = ({socket, room}) => {
    const [message, setMessage] = useState('')
    const style = {
        input: {
            position: 'fixed',
            bottom: 0,
            width: '75%',
            height: '10%',
            backgroundColor: '#202636',
            borderSizing: 'border-box',
        },

        textField: {
            width: '90%',
            fontSize: 'x-large',
            outline: 'none',
            paddingLeft: '20px',
            paddingBottom: '10px',
            paddingTop: '10px',
            marginTop: '20px',
            marginLeft: '30px',
            backgroundColor: 'transparent',
            color: '#ffffff',
            border: '1px solid #4a336e',
            borderRadius: 30,
        },

        button: {
            top: 25,
            right: 20,
            position: 'absolute'
        }
    }

    const sendMessage = () => {
        socket.emit('chat', message, Cookies.get('userId'), room._id)
    }

    return (
        <div style={style.input}>
            <form onSubmit={(e) => e.preventDefault()}>
                <div style={{width: '100%'}}>
                    <input
                        type='text'
                        style={style.textField}
                        value={message}
                        onKeyUp={(e) => {
                            if(e.key === 'Enter')
                            {
                                sendMessage()
                                setMessage('')
                            }
                        }}
                        placeholder='...'
                        onChange={(e) => setMessage(e.target.value)}>
                    </input>
                </div>
            </form>
            <div style={style.button} >
                    <SendIcon 
                        color='primary' 
                        fontSize='large'
                        onClick={() => {
                            sendMessage()
                                setMessage('')
                            }
                        }
                    ></SendIcon>
            </div>
        </div>
    )
}

export default Input