import { useState, useEffect } from 'react';
import '../src/App.css';
import io from 'socket.io-client';
import axios from "axios";
import Cookies from "js-cookie";
import ChatWindow from "./Components/ChatWindow";
import Login from './Components/Login/Login';
import Loading from './Components/Loading';
import UserArea from "./Components/UserInformation/UserArea";
import FindRoom from "./Components/Rooms/FindRoom";
import RoomManage from "./Components/Room/RoomManage";
import RoomsList from "./Components/Rooms/RoomsList";
import { useMediaQuery } from 'react-responsive'

const socket = io.connect('/')

function App() {
  const [connected, setConnect] = useState(false)
  const [error, setError] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [roomId, setRoomId] = useState('')
  const [roomPanel, setPanel] = useState(false)
  const [currentRoom, setCurrentRoom] = useState({
    _id: -1,
    room_name: " ",
    color: ''
  })
  const [rooms, setRooms] = useState([])
  const [login, setLogin] = useState(false)

  const limit = useMediaQuery({maxWidth: 1300})

  const style = {
    left: {
      width: limit ? '15em' : '25%',
      float: 'left',
      background: 'transparent',
      height: '100%',
      boxSizing: 'border-box',
      borderRight: '2px solid #4a336e'
    },

    right: {
      width: '75%',
      height: '100%',
      float: 'left',
      position: 'relative',
    },

    userInformation: {
      display: 'flex',
      alignItems: 'center',
      borderBottom: '2px solid #4a336e',
      padding: '20px',
      fontSize: 'large',
      marginBottom: '10px',
    },
  }

  const logIn = async (user) => {
    const result = await axios.post('/user/login', user, {withCredentials: true})
    setAuthenticated(result.data._id !== undefined)
    setError(result.data._id === undefined)
    setUser(result.data)

    const listOfRooom = await axios.get('/room/retrieve', {withCredentials: true})
    setRooms(listOfRooom.data)
    if(listOfRooom.data.length !== 0)
      setCurrentRoom(listOfRooom.data[0])
  }

  const leaveRoom = async (id) => {
    axios.post('/room/leave', {id: id}, {withCredentials: true}).then(result => {
      const index = rooms.findIndex(room => room._id === id)
      if(index !== -1)
      {
        rooms.splice(index, 1)
        const tmp = [...rooms]
        tmp.every((room, index) => {
          if(room._id === id)
          {
            tmp.splice(index, 1)
            return false
          }
          return true
        })
        if(rooms.length !== 0)
          setCurrentRoom(rooms[0])
        else
          setCurrentRoom({
            _id: -1,
            room_name: " ",
            color: ''
          })
      }
    })
    
  }

  const findRoom = async () => {
    const index = rooms.findIndex(room => room.short_id === roomId)
    if(index === -1)
    {
      axios.post('/room/find', {id: roomId}, {withCredentials: true}).then(reponse => {
        setRooms([reponse.data, ...rooms])
      })
    }
  }

  const joinRoom = async (room) => {
    if(room)
    {
      const response = await axios.post('/room/create', room, {withCredentials: true})
      if(response)
      {
        setRooms([response.data.room, ...rooms])
        setCurrentRoom(response.data.room)
      }
    }
  }

  const switchRoom = (newRoom) => {
    if(newRoom._id !== currentRoom._id)
    {
      socket.emit('leaveRoom', currentRoom._id, newRoom._id)
      setCurrentRoom(newRoom)
    }
    setCurrentRoom(newRoom)
  }

  const logout = async () => {
    const response = await axios.get('/user/logout', {withCredentials: true})
    if(response)
    {
      setAuthenticated(false)
      setLogin(false)
      setCurrentRoom({
        _id: -1,
        room_name: " ",
        color: ''
      })
      setRooms([])
    }
  }

  const roomManage = (room) => {
    setPanel(true)
  }

  useEffect(() => {
    setLogin(Cookies.get('userId') !== undefined)
    if(Cookies.get('userId') !== undefined && !authenticated)
    {
      axios.get('/user/find', {withCredentials: true}).then((response) => {
        setUser(response.data)
      })

      axios.get('/room/retrieve', {withCredentials: true}).then((response) => {
        setRooms(response.data)
        if(response.data.length !== 0)
        {
          setCurrentRoom(response.data[0])
        }
      })
      setAuthenticated(true)
    }
    socket.once('connected', () => setConnect(true))
  }, [user, rooms, authenticated])

  useEffect(() => {
    if(currentRoom)
    {
      socket.emit('joinRoom', currentRoom)
    }
  }, [currentRoom])

  return (
    <div className="App">
      {!connected ? <Loading></Loading> : (((authenticated || login) && user) ? 
      <div style={{position: 'relative', width: '100%', height: '100%'}}>
        <div style={{height: '100%', display: 'flex'}}>
          <div style={style.left}>
            <UserArea user={user} logout={logout}></UserArea>
            <RoomsList currentRoom={currentRoom} rooms={rooms} joinRoom={joinRoom} leaveRoom={leaveRoom} switchRoom={switchRoom} roomManage={roomManage}/>
            <FindRoom roomId={roomId} setRoomId={setRoomId} findRoom={findRoom}></FindRoom>
          </div>
          <div style={style.right}>
            <ChatWindow socket={socket} room={currentRoom} leave={leaveRoom}></ChatWindow>
          </div>
        </div>
        <RoomManage room={currentRoom} manageToggle={roomPanel} setPanel={setPanel}></RoomManage>
      </div> : <Login logIn={logIn} invalid={error} errorToggle={setError}></Login>)}
    </div>
  );
}

export default App;