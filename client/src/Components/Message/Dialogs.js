import Dialog from './Dialog'
import { useEffect, useRef } from 'react'

const Dialogs = ({socket, room, dialogs, deleteMessage}) => {
    const style = {
        paddingTop: '10px',
        overflow: 'auto',
        height: '88%',
        display: 'block',
        width: '100%',
    }

    const MessEnding = useRef(null)

    useEffect(() => {
        MessEnding.current.scrollIntoView({ behavior: 'smooth' })
    }, [dialogs])

    return (
        <div style={style}>
            {dialogs.map((dialog) => {
                return <Dialog key={dialog._id} socket={socket} dialog={dialog} onDelete={deleteMessage} room={room}></Dialog>
            })}
            <div ref={MessEnding} />
        </div>
    )
}

export default Dialogs