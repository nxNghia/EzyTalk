const express = require('express')
const shortid = require('shortid')

const User = require('../models/user.model')
const Room = require('../models/room.model')
const Attend = require('../models/Attend')
const mongoose = require('mongoose')

const router = express.Router()

//get full list of rooms that user has attended
router.get('/retrieve', (request, response) => {
  const id = request.cookies.userId

  Attend.find({ user_id: id}).then(rooms => {
    const promises = []
    rooms.forEach(room => {
      const sub_promise = new Promise((resolve, reject) => {
        Room.findOne({ _id: room.room_id }).then(result => resolve(result))
      })
      promises.push(sub_promise)
    })

    Promise.all(promises).then(result => {
      response.send(result)
    })
  })
})

//create a room
router.post('/create', (request, response) => {

  const new_room = new Room({
    short_id: shortid.generate(),
    room_name: request.body.room_name,
    color: Math.floor(Math.random() * 16777215).toString(16)
  })

  new_room.save((err, result) => {
    const attend = new Attend({room_id: mongoose.Types.ObjectId(result._id), user_id: mongoose.Types.ObjectId(request.cookies.userId)})
    attend.save((err, result2) => {
      response.send({room: result})
    })
  })
})

//find a room
router.post('/find', (request, response) => {
  Room.findOne({ short_id: request.body.id }).then(room => {
    if(room)
    {
      const new_attend = new Attend({
        user_id: request.cookies.userId,
        room_id: room._id
      })

      new_attend.save(err => {
        response.send(room)
      })
    }
  })
})

//leave the room
router.post('/leave', (request, response) => {
  const cookie = request.cookies.userId
  const room_id = request.body.id

  Attend.deleteOne({ room_id: room_id, user_id: cookie }).then((result) => {
    response.send(room_id)
  })
})

router.post('/members', (request, response) => {
  const room_id = request.body.roomId
  Attend.find({ room_id: room_id }).then(rooms => {
    const promises = []
    rooms.forEach(room => {
      const sub_promise = new Promise((resolve, reject) => {
        User.findOne({ _id: room.user_id }).then(result => resolve(result))
      })
      promises.push(sub_promise)
    })

    Promise.all(promises).then(result => {
      response.send(result)
    })
  })
})

module.exports = router