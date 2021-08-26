import ChatWindow from "./Components/ChatWindow";
import { useState, useEffect } from 'react';
import Login from './Components/Login';
import '../src/App.css';
import io from 'socket.io-client';
import Loading from './Components/Loading';
import axios from "axios";
import CreateRoom from "./Components/CreateRoom";
import Room from './Components/Room';
import Cookies from "js-cookie";
import UserArea from "./Components/UserArea";
import FindRoom from "./Components/FindRoom";

const socket = io.connect('/')

function App() {
  const [connected, setConnect] = useState(false)
  const [valid, setValid] = useState(false)
  const [user, setUser] = useState(null)
  const [roomId, setRoomId] = useState('')
  const [currentRoom, setCurrentRoom] = useState(null)
  const [rooms, setRooms] = useState([])
  const [login, setLogin] = useState(false)

  const style = {
    left: {
      width: '25%',
      float: 'left',
      background: '#202636',
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
    console.log(user)
    const result = await axios.post('/user/login', user, {withCredentials: true})
    setValid(result.data._id !== undefined)
    setUser(result.data)
    if(result.data.rooms.length !== 0)
    {
      const listOfRooom = await axios.get('/room/retrieve', {withCredentials: true})
      setRooms(listOfRooom.data)
      setCurrentRoom(listOfRooom.data[0])
    }
  }

  const leaveRoom = (id) => {
    axios.post('/room/leave', {id: id}, {withCredentials: true}).then((response) => {
      console.log(response.data)
      const index = rooms.findIndex(room => room._id === id)
      rooms.splice(index, 1)
      if(rooms.length !== 0)
        setCurrentRoom(rooms[0])
      else
        setCurrentRoom(null)
    })
  }

  const findRoom = () => {
    console.log('begin')
    axios.post('/room/find', {id: roomId}, {withCredentials: true})
    .then((response) => {
      console.log(response.data)
      console.log(user.rooms)
      const exist = user.rooms.findIndex((room) => room.roomId === response.data._id)
      console.log(exist)
      if(exist === -1)
      {
        setRooms([response.data, ...rooms])
      }
    })
  }

  const joinRoom = async (room) => {
    if(room)
    {
      const result = await axios.post('/room/create', room, {withCredentials: true})
      setUser(result.data.user)
      setRooms([...rooms, result.data.room])
      setCurrentRoom(result.data.room)
    }
  }

  const switchRoom = (newRoom) => {
    if(newRoom._id !== currentRoom._id)
    {
      socket.emit('leaveRoom', currentRoom._id, newRoom._id)
      setCurrentRoom(newRoom)
    }
  }

  const logout = () => {
    axios.get('/user/logout', {withCredentials: true}).then((response) => {
      setValid(false)
      setLogin(false)
      setCurrentRoom(null)
      setRooms([])
    })
  }

  useEffect(() => {
    setLogin(Cookies.get('userId') !== undefined)
    if(Cookies.get('userId') !== undefined && !valid)
    {
      axios.get('/user/find', {withCredentials: true}).then((response) => {
        setUser(response.data)
      })

      axios.get('/room/retrieve', {withCredentials: true}).then((response) => {
        setRooms(response.data)
        setCurrentRoom(response.data[0])
      })
      setValid(true)
    }
    socket.once('connected', () => setConnect(true))
  }, [user, rooms])

  useEffect(() => {
    if(currentRoom)
    {
      socket.emit('joinRoom', currentRoom._id)
    }
  }, [currentRoom])

  return (
    <div className="App">
      {!connected ? <Loading></Loading> : (((valid || login) && user) ? <div style={{height: '100%'}}>
      <div style={style.left}>
        <UserArea user={user} logout={logout}></UserArea>
        <div>
          {rooms.map((room) => {
            return (
              <Room key={room._id} room={room} onClick={switchRoom}></Room>
            )
          })}
          <CreateRoom joinRoom={joinRoom}></CreateRoom>
        </div>
        <FindRoom roomId={roomId} setRoomId={setRoomId} findRoom={findRoom}></FindRoom>
      </div>
      <div style={style.right}>
        <ChatWindow socket={socket} room={currentRoom} leave={leaveRoom}></ChatWindow>
      </div>
      </div> : <Login logIn={logIn}></Login>)}
    </div>
  );
}

export default App;