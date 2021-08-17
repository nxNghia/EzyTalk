import Dialog from './Dialog'
import RoomBanner from './RoomBanner'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

const Alert = (props) => {
    return <MuiAlert elevation={6} variant='filled' {...props} />
}

const Dialogs = ({socket, room, leave}) => {
    const style = {
        paddingTop: '10px',
        overflow: 'auto',
        height: '91%',
        display: 'block',
        width: '100%',
    }

    const [dialogs, setDialogs] = useState([])
    const [deleteId, setDeleteId] = useState(null)
    const [error, setError] = useState(false)

    const MessEnding = useRef(null)

    const deleteMessage = (dialog) => {
        const cookie = Cookies.get('userId')
        const index = cookie.indexOf('"')
        const new_cookie = cookie.slice(index + 1, cookie.length - 1)
        if(new_cookie === dialog.from.id)
        {
            setDeleteId(dialog._id)
            console.log(dialog._id)
            socket.emit('delete', dialog._id, room._id)
        }else{
            setError(true)
        }
    }

    useEffect(() => {
        if(room)
        {
            axios.post('/chat/retrieve', room, {withCredentials: true}).then(response => {
                setDialogs(response.data)
                console.log(response.data)
            })
        }

    }, [room])

    useEffect(() => {
        socket.on('your_new_message', (dialog) => {
            console.log(dialog)
            setDialogs([...dialogs, dialog])
            MessEnding.current.scrollIntoView({ behavior: 'smooth'})
            
        })

        socket.on('dialog-deleted', (id) => {
            setDeleteId(id)
            console.log(id)
        })
        
        socket.on('return-reaction', (dialog) => {
            console.log('dialog')
            // const result = dialogs.find(d => d.textId === dialog.textId)

            // if (result != null)
            //     result.reactions = dialog.reactions
        })

        if(dialogs === null)
            setDialogs(room.conversations)

        if(deleteId !== null)
        {
            console.log(dialogs, deleteId)
            const index = dialogs.findIndex(dialog => dialog._id === deleteId)
            console.log(index)
            if(index !== -1)
                dialogs.splice(index, 1)
            setDeleteId(null)
        }
        
        return () => {
            socket.off('your_new_message')
            socket.off('dialog-deleted')
            socket.off('return-reaction')
        }
    }, [dialogs, deleteId])

    return (
        <div style={style}>
            {room && <RoomBanner room={room} leave={leave}></RoomBanner>}
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
            {dialogs.map((dialog) => {
                return <Dialog key={dialog._id} socket={socket} dialog={dialog} onDelete={deleteMessage} room={room}></Dialog>
            })}
            <div ref={MessEnding} />
        </div>
    )
}

export default Dialogs