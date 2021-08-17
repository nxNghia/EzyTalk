const express = require('express')
const shortid = require('shortid')

const User = require('../models/user.model')
const Room = require('../models/room.model')
const Chat = require('../models/chat.model')

const router = express.Router()

router.get('/retrieve', (request, response) => {
    const id = request.cookies.userId
    User.findOne({_id: id}).then(user => {
      if(user)
      {
        const promises = []
        user.rooms.forEach(room => {
          const sub_promise = new Promise((resolve, reject) => {
            Room.findOne({_id: room.roomId}).then(result => resolve(result))
          })
          promises.push(sub_promise)
        })
  
        Promise.all(promises).then(result => response.send(result))
      }
    })
})

router.post('/create', (request, response) => {
    User.findOne({_id: request.cookies.userId}).then(user => {
      if(user)
      {
        const new_room = {
          short_id: shortid.generate(),
          room_name: request.body.room_name,
          public: request.body.public,
          members: [],
          conversations: []
        }
  
        new_room.members.push(user._id)
        const room = new Room(new_room)
        room.save((err, result) => {
          if(err) return handleError(err)
          user.rooms.push({roomId: result._id})
          user.save((err2, result2) => {
            if(err2) return handleError(err2)
            response.send({user: result2, room: result})
          })
        })
      }
    })
})

router.post('/find', (request, response) => {
    Room.findOne({short_id: request.body.id}).then((result) => {
      if(result)
      {
        User.findOne({_id: request.cookies.userId}).then(user => {
          if(user.rooms.findIndex(room => room.roomId === result._id) === -1)
          {
            user.rooms.push({roomId: result._id})
            user.save(err => {
              if(err) handleError(err)
            })
          }
        })
        result.members.push({userId: request.cookies.userId})
        result.save(err => {
          if(err) handleError(err)
        })
        response.send(result)
      }
    })
})

router.post('/leave', (request, response) => {
  const cookie = request.cookies.userId
  User.findOne({_id: cookie}).then(user => {
    if(user)
    {
      console.log(request.body)
      const index = user.rooms.findIndex(room => room.roomId == request.body.id)
      if(index !== -1)
      {
        user.rooms.splice(index, 1)
        user.save(err => {
          if(err)
            handleError(err)
        })
        console.log(index)
      }
    }
    response.send(user.rooms)
  })
})

module.exports = router