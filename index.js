require('dotenv').config()
const express = require('express')
const path = require('path')
const app = express()
const socket = require('socket.io')
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model')
const Room = require('./models/room.model')
const Chat = require('./models/chat.model')
const Reaction = require('./models/reaction.model')
const Attend = require('./models/Attend')
const {React, getReactionsByMessage} = require('./models/React')
const userRouter = require('./routes/user.routes')
const roomRouter = require('./routes/room.routes')
const chatRouter = require('./routes/chat.routes')
const reactionRouter = require('./routes/reaction.routes')
const cookieParser = require('cookie-parser')

const mongourl = process.env.MONGO_URL || 'mongodb://localhost:27017'

try{
  mongoose.connect(
    mongourl,
    {useNewUrlParser: true, useUnifiedTopology: true},
  )
}catch (e) {
  console.log('failed')
}

const db = mongoose.connection
db.on('error', console.error.bind(console, 'error:'))
db.once('open', () => {})

app.use(express());
app.use(express.static(path.join(__dirname + '/client/build')))
const port = process.env.PORT || 8000

app.use(cors({
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200,
}))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

const server = app.listen(port, () => console.log(`Running on port ${port}`))

app.use('/user', userRouter)
app.use('/chat', chatRouter)
app.use('/room', roomRouter)
app.use('/reaction', reactionRouter)

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname + '/client/build/index.html'))
})

const io = socket(server)

io.on('connection', (socket) => {
  socket.emit('connected')
  socket.on('joinRoom', (currentRoom) => {
    if(currentRoom._id !== -1)
    {
      socket.join(currentRoom._id)
    }
  })

  socket.on('leaveRoom', (currentRoom) => {
    socket.leave(currentRoom._id)
  })

  //message sending event has been fired from a socket
  socket.on('chat', (message, cookie, currentRoom) => {
    const index = cookie.indexOf('"')
    const new_cookie = cookie.slice(index + 1, cookie.length - 1)

    User.findOne({ _id: new_cookie }).then(result => {
      if(result)
      {
        //get userinfo
        User.findOne({ _id: new_cookie }).then(user => {
          //create a message model
          const message_instance = {
            content: message,
            in: mongoose.Types.ObjectId(currentRoom),
            from: {
              userId: result._id,
              username: result.username,
              color: result.color
            }
          }
          const message_model = new Chat(message_instance)
          message_model.save((err, result) => {
            io.in(currentRoom).emit('your_new_message', result)
          })
        })
      }
    })
  })

  //delete a message
  socket.on('delete', (id, room) => {
    Chat.deleteOne({ _id: id }).then(result => {
      socket.to(room._id).emit('dialog-deleted', id)
    })
  })

  //reaction event has been fired
  socket.on('get-reaction', (dialog, reactionType, cookie, roomId) => {

    //get userinfo
    User.findOne({ _id: cookie }).then(user => {
      React.findOne({ react_at: dialog._id, from: {
        userId: mongoose.Types.ObjectId(cookie),
        username: user.username
      }}).then(react_info => {
        if(react_info)
        {
          if(react_info.react_id == reactionType)
          {
            React.deleteOne({ react_at: dialog._id, from: {userId: user._id, username: user.username}, react_id: reactionType }).then((r) => {
              React.find({ react_at: dialog._id }).then(result => {
                const edited_list = getReactionsByMessage(result)
                edited_list._id = dialog._id
                socket.to(roomId).emit('return-reaction', edited_list)
              })
            })
          }else{
            react_info.react_id = reactionType
            react_info.save(err => {
              if(err)
                handleError(err)
              React.find({ react_at: dialog._id }).then(result => {
                const edited_list = getReactionsByMessage(result)
                socket.to(roomId).emit('return-reaction', edited_list)
              })
            })
          }
        }else{
          const new_react = new React({
            react_id: reactionType,
            react_at: mongoose.Types.ObjectId(dialog._id),
            from: {
              userId: mongoose.Types.ObjectId(cookie),
              username: user.username
            }
          })
    
          new_react.save(err => {
            if(err) handleError(err)
            React.find({ react_at: dialog._id }).then(result => {
              const edited_list = getReactionsByMessage(result)
              socket.to(roomId).emit('return-reaction', edited_list)
            })
          })
        }
      })
    })
  })

  socket.on('disconnect', () => {})
})