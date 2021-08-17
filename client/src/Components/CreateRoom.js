import AddCircleIcon from '@material-ui/icons/AddCircle';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';

const CreateRoom = ({joinRoom}) => {
    const [roomClick, setRoomClick] = useState(false)
    const [findBtn, setFindBtn] = useState(false)
    const [room, setRoom] = useState({room_name: 'new room', public: true})

    const style = { 
        roomBtn: {
            cursor: 'pointer',
            color: '#4a336e',
        },

        createRoom: {
            position: 'relative',
            width: '90%',
            margin: 'auto',
            background: '#6F81B2',
            padding: '10px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: roomClick ? 'block' : 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            height: roomClick ? '150px' : '100px',
            transition: 'height 250ms ease 0ms'
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

        innerBtn: {
            background: 'rgba(53,93,202,0.3)',
            position: 'absolute',
            right: 0,
            left: 'auto',
            top: 0,
            height: '100%',
            width: findBtn ? '100%' : '0%',
            transition: 'width 200ms ease 0s',
            paddingTop: '100%',
        }
    }

    const toggleRoom = () => {
        if(roomClick)
          return
    
        setRoomClick(true)
    }

    return (
        <div style={style.createRoom} className='create-room' onClick={() => toggleRoom()}>
            {roomClick ? 
              <>
                <TextField style={style.createRoomForm}
                  placeholder="room's name"
                  value={room.id}
                  onChange={(e) => setRoom({...room, room_name: e.target.value})}
                ></TextField>
                <Grid container style={style.switch}>
                  <Grid item>
                    Public
                  </Grid>
                  <Grid item>
                    <Switch color='primary' onChange={(e) => setRoom({...room, public: !e.target.checked})}></Switch>
                  </Grid>
                  <Grid item>
                    Private
                  </Grid>
                </Grid>
                <div style={{position: 'absolute', top: 5, left: 5}}>
                  <ArrowBackIcon onClick={() => {
                    setRoomClick(false)
                    }}></ArrowBackIcon>
                </div>
                <div
                  style={style.findRightBtn}
                  onMouseEnter={() => setFindBtn(true)}
                  onMouseLeave={() => setFindBtn(false)}
                  onClick={() => {
                    setRoomClick(false)
                    joinRoom(room)
                  }}
                >
                  <div style={style.innerBtn}>
                    <ArrowForwardIosIcon></ArrowForwardIosIcon>
                  </div>
                </div>
              </> 
              : 
              <>
                <AddCircleIcon style={style.addBtn}></AddCircleIcon>
                <p style={{color: '#ffffff'}}>Create room</p>
              </>
            }
            
          </div>
    )
}

export default CreateRoom