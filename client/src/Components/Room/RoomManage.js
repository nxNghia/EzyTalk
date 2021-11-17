import { useEffect, useState } from "react"
import Members from "./Member"
import { TextField, FormControl } from "@material-ui/core"

const RoomManage = ({room, manageToggle, setPanel}) => {
    const [tmp_roomName, setRoomName] = useState(room?.room_name)
    const style = {
        overlay: {
            width: '100%',
            height: '100%',
        },

        managePanel: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            overflow: 'auto',
            margin: 'auto',
            width: '30%',
            height: '75%',
            background: '#fff',
            padding: '10px',
            borderRadius: '20px',
        },

        manage: {
            position: 'fixed',
            background: 'rgba(0, 0, 0, 0.8)',
            top: 0,
            width: '100%',
            height: '100%',
        },

        button: {
            position: 'fixed',
            bottom: '75%'
        }
    }


    useEffect(() => {
        setRoomName(room.room_name)
    }, [room])

    return manageToggle ? (
        <div style={style.manage}>
            <div style={style.overlay} onClick={() => {
                setPanel(false)
            }}></div>
            <div style={style.managePanel}>
                <div style={{textAlign: 'center'}}>
                    <h2>Room management</h2>
                </div>
                <h3>Name</h3>
                <FormControl fullWidth sx={{m:1}}>
                    <TextField
                        value={tmp_roomName}
                        onChange={e => {
                            setRoomName(e.target.value)
                        }}
                    />
                </FormControl>
                <h3>Short id</h3>
                <FormControl fullWidth sx={{m:1}}>
                    <TextField
                        disabled
                        value={room.short_id}
                    />
                </FormControl>
                <h3>Members</h3>
                <Members room={room}></Members>
            </div>
        </div>
    ) : ""
}

export default RoomManage