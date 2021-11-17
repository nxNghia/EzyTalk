import Input from "./Message/Input"
import Dialogs from "./Message/Dialogs"
import axios from 'axios'
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

const Alert = (props) => {
    return <MuiAlert elevation={6} variant='filled' {...props} />
}

const ChatWindow = ({socket, room, leave}) => {
    const [dialogs, setDialogs] = useState([])
    const [currentRoom, setRoom] = useState(room)
    const [newMessage, setNewMessage] = useState(null)
    const [error, setError] = useState(false)

    const style = {
        container: {
            position: 'absolute',
            background: 'transparent',
            height: '100%',
            width: '100%',
            margin: 0,
            bottom: 0,
        }
    }

    const dialogsUpdate = (new_dialog) => {
        socket.emit('chat', new_dialog, Cookies.get('userId'), room._id)
    }

    const deleteMessage = (dialog) => {
        const cookie = Cookies.get('userId')
        const index = cookie.indexOf('"')
        if(dialog.from.userId === cookie.slice(index + 1, cookie.length - 1))
        {
            const temp = [...dialogs]

            temp.every((d, index) => {
                if(d._id === dialog._id)
                {
                    temp.splice(index, 1)
                    return false
                }

                return true
            })

            setDialogs([...temp])
        
            socket.emit('delete', dialog._id, room)
        }
        
        setError(cookie.slice(index + 1, cookie.length - 1) !== dialog.from.userId)
    }

    useEffect(() => {
        setRoom(room)
        if(room._id !== -1)
            axios.post('http://localhost:8000/chat/retrieve', room, {withCredentials: true}).then(response => {
                setDialogs(response.data)
            })
    }, [room])

    useEffect(() => {
        socket.on('your_new_message', (dialog) => {
            setNewMessage(dialog)
        })

        socket.on('dialog-deleted', (id) => {
            console.log(dialogs)
            const temp = [...dialogs]
            temp.every((d, index) => {
                if(d._id === id)
                {
                    
                    temp.splice(index, 1)
                    return false
                }

                return true
            })

            setDialogs([...temp])
        })

        return () => {
            socket.off('your_new_message')
            socket.off('dialog-deleted')
        }
    }, [dialogs, socket])

    useEffect(() => {
        if(newMessage)
            setDialogs([...dialogs, newMessage])
            
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newMessage])

    return (
        <div style={style.container}>
            <Snackbar
                open={error}
                autoHideDuration={2000}
                onClose={() => setError(false)}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
            <Alert onClose={() => setError(false)} severity='error'>
                You can not delete other's comment!
            </Alert>
            </Snackbar>
            <Dialogs room={currentRoom} socket={socket} dialogs={dialogs} setDialogs={setDialogs} deleteMessage={deleteMessage}></Dialogs>
            <Input room={currentRoom} setDialogs={dialogsUpdate} socket={socket}></Input>
        </div>
    )
}

export default ChatWindow