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
const userRouter = require('./routes/user.routes')
const roomRouter = require('./routes/room.routes')
const chatRouter = require('./routes/chat.routes')
const cookieParser = require('cookie-parser')

const mongourl = process.env.MONGO_URL || 'mongodb://localhost:27017'

try{
  mongoose.connect(
    mongourl,
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => console.log('connected to database')
  )
}catch (e) {
  console.log('failed')
}

const db = mongoose.connection
db.on('error', console.error.bind(console, 'error:'))
db.once('open', () => {
  console.log('connected to socket.io')
})

app.use(express());
app.use(express.static(path.join(__dirname + '/client/build')))
const port = process.env.PORT || 8000

app.use(cors(
  {credentials: true,
  }
))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

var server = app.listen(
  port,
  console.log(`running on port ${port}`)
)

const io = socket(server)

app.use('/user', userRouter)
app.use('/chat', chatRouter)
app.use('/room', roomRouter)

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname + '/client/build/index.html'))
})

io.on('connection', (socket) => {
  socket.emit('connected')

  socket.on('joinRoom', (currentRoom) => {
    console.log('join ' + currentRoom)
    socket.join(currentRoom)
  })

  socket.on('leaveRoom', (currentRoom, newRoom) => {
    console.log('leave ' + currentRoom)
    socket.leave(currentRoom)
  })

  socket.on('chat', (message, cookie, currentRoom) => {
    const index = cookie.indexOf('"')
    const new_cookie = cookie.slice(index + 1, cookie.length - 1)
    User.findOne({_id: new_cookie}).then((user) => {
      const chat = {
        text: message,
        from: {
          id: user._id,
          name: user.username
        },
        reaction: []
      }

      const chat_instance = new Chat(chat)
      chat_instance.save((err, result) => {
        const newDialog = {
          from:{
            id: user.id,
            name: user.username
          },
          text: result.text,
          _id: result._id,
          reactions: []
        }
        Room.findOne({_id: currentRoom}).then(room => {
          room.conversations.push({textId: result._id})
          room.save(err => {
            if(err) handleError(err)
          })
        })
        io.in(currentRoom).emit('your_new_message', newDialog)
      })
    })
  })

  socket.on('delete', (id, roomId) => {
    Chat.deleteOne({_id: id}).then(() => console.log('deleted'))
    Room.findOne({_id: roomId}).then(response => {
      const index = response.conversations.findIndex(con => con.textId == id)
      response.conversations.splice(index, 1)
      response.save(err => {if(err) handleError(err)})
    })
    io.in(roomId).emit('dialog-deleted', id)
  })

  socket.on('get-reaction', (dialog, reactionType, cookie, roomId) => {
    const index = cookie.indexOf('"')
    const new_cookie = cookie.slice(index + 1, cookie.length - 1)
    Chat.findOne({_id: dialog._id}).then(return_dialog => {
      Room.find().then(rooms => {
        rooms.every(room => {
          const return_room = room.conversations.find(conversation => conversation.textId == return_dialog._id)
          if(return_room)
          {
            let add = true

            return_dialog.reactions.every(reaction => {
              let user_index = reaction.users.findIndex(user => user.userId === new_cookie)
              console.log(user_index)
              if(user_index !== -1)
              {
                add = !(reaction.reactionType == reactionType)
                reaction.users.splice(user_index, 1)
                return false
              }

              return true
            })
            const reactionObj = return_dialog.reactions.find(reaction => reaction.reactionType == reactionType)
            if(reactionObj === undefined)
            {
              const newReaction = {reactionType: reactionType, users: []}
              newReaction.users.push({userId: new_cookie})
              return_dialog.reactions.push(newReaction)
            }else{
              if(add)
                reactionObj.users.push({userId: new_cookie})
            }
            temp = room._id
            return_dialog.save(err => {
              if(err) handleError(err)
            })
            io.in(roomId).emit('return-reaction', return_dialog)
            return false
          }
          return true
        })
      })
    })
  })

  socket.on('disconnect', () => {
    
  })
})