import SendIcon from '@material-ui/icons/Send';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive'
import { TextField, FormControl, InputAdornment } from "@material-ui/core"

const Input = ({setDialogs}) => {
    const [message, setMessage] = useState('')
    const limit = useMediaQuery({maxWidth: 900})
    const limit2 = useMediaQuery({maxWidth: 600})
    const style = {
        input: {
            position: 'fixed',
            bottom: 10,
            width: '75%',
            height: '10%',
            borderSizing: 'border-box',
        },

        textField: {
            width: limit2 ? '60%' : limit ? '70%' : '90%',
            fontSize: 'x-large',
            outline: 'none',
            paddingLeft: '20px',
            paddingBottom: '10px',
            paddingTop: '10px',
            marginTop: '0px',
            marginLeft: '30px',
            backgroundColor: 'transparent',
            color: '#000000',
        },

        button: {
            top: 25,
            right: 20,
            position: 'absolute'
        }
    }

    const sendMessage = () => {
        setDialogs(message)
    }

    return (
        <div style={style.input}>
            <FormControl fullWidth sx={{m:1}}>
                <TextField
                    style={style.textField}
                    value={message}
                    onKeyUp={(e) => {
                        if(e.key === 'Enter')
                        {
                            sendMessage()
                            setMessage('')
                        }
                    }}
                    id="outlined-basic"
                    variant="outlined"
                    placeholder='...'
                    onChange={(e) => setMessage(e.target.value)}
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <SendIcon
                              onClick={() => {
                                sendMessage()
                                setMessage('')
                              }}
                              color='primary'
                              fontSize='large'
                            />
                          </InputAdornment>
                        )
                      }}
                />
            </FormControl>
        </div>
    )
}

export default Input