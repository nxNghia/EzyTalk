import Input from "./Input"
import Dialogs from "./Dialogs"
import { useEffect } from "react"

const ChatWindow = ({socket, room, leave}) => {
    const style = {
        container: {
            position: 'absolute',
            background: '#202636',
            height: '100%',
            width: '100%',
            margin: 0,
            bottom: 0,
        }
    }

    useEffect(() => {
    }, [room])

    return (
        <div style={style.container}>
            <Dialogs socket={socket} room={room} leave={leave}></Dialogs>
            {room && <Input socket={socket} room={room}></Input>}
        </div>
    )
}

export default ChatWindow