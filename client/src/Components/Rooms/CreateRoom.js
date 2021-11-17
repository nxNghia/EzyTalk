import AddCircleIcon from '@material-ui/icons/AddCircle';
import { FormControl, TextField } from '@material-ui/core';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive'

const CreateRoom = ({joinRoom}) => {
    const [roomClick, setRoomClick] = useState(false)
    const [room, setRoom] = useState({room_name: ' '})

    const limit = useMediaQuery({maxWidth: 1300})

    const style = { 
        roomBtn: {
            cursor: 'pointer',
            color: '#4a336e',
        },

        createRoom: {
            position: 'relative',
            width: limit ? '12em' : '90%',
            height: '5em',
            margin: 'auto',
            marginBottom: "1em",
            background: '#6F81B2',
            padding: '10px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',

            alignItems: 'center',
            overflow: 'hidden',
        },

        addBtn: {
            color: '#355DCA',
            fontSize: '60px',
            marginRight: '30px',
            marginLeft: '10px'
        },

        createRoomForm: {
            padding: 30,
        },
        
        switch: {
            marginLeft: 30,
            color: '#ffffff'
        },

        findRightBtn: {
            position: 'absolute',
            right: 0,
            left: 'auto',
            top: 0,
            height: '100%',
            width: '15%',
        },

        beforeClick: {
          maxWidth: roomClick ? '0' : '100%',
          display: 'flex',
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          transition: 'max-width 300ms'
        },

        afterClick: {
          position: 'relative',
          width: '90%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          maxWidth: roomClick ? '100%' : '0',
          transition: 'max-width 300ms',
          overflow: 'hidden'
        },

        closeIcon: {
          position: 'absolute',
          top: "-0.25em",
        }
    }

    const toggleRoom = () => {
        if(roomClick)
          return
    
        setRoomClick(true)
    }

    return (
      <div style={style.createRoom} className='create-room' onClick={() => toggleRoom()}>
        <div style={style.beforeClick}>
          <AddCircleIcon style={style.addBtn}></AddCircleIcon>
          <p style={{color: '#ffffff'}}>Create room</p>
        </div>
        <div style={style.afterClick}>
          <span
            style={style.closeIcon}
            onClick={() => {
              setRoomClick(false)
            }}
          >X</span>
          <FormControl fullWidth sx={{m:1}}>
            <TextField
              placeholder="Room name"
              value={room.room_name}
              onKeyUp={e => {
                if(e.key === "Enter")
                {
                  joinRoom(room)
                  setRoom({...room, room_name: ''})
                }
              }}
              onChange={e => setRoom({...room, room_name: e.target.value})}
            ></TextField>
          </FormControl>
        </div>
      </div>
    )
}

export default CreateRoom