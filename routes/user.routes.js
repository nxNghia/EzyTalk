const express = require('express')

const User = require('../models/user.model')
const Room = require('../models/room.model')
const Chat = require('../models/chat.model')

const router = express.Router()

router.get('/find', (request, response) => {
    User.findOne({_id: request.cookies.userId}).then((user) => {
      response.send(user)
    })
})

router.get('/logout', (request, response) => {
    response.clearCookie('userId')
    response.send()
})

router.post('/signin', (request, response) => {
    const result = {
      username: request.body.username,
      password: request.body.password,
      rooms: []
    }
  
    const newUser = new User(result)
    newUser.save((err) => {
      if(err) return handleError(err)
    })
  
    response.send({valid: true})
})

router.post('/login', (request, response) => {
    const result = {
      username: request.body.username,
      password: request.body.password
    }
  
    User.findOne({username: result.username, password: result.password}).then(user => {
      if(user !== null)
      {
        response.cookie('userId', user._id)
      }
      response.send(user)
    })
})

module.exports = router