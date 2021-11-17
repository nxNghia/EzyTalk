const express = require('express')

const Chat = require('../models/chat.model')

const router = express.Router()

//get message from one room
router.post('/retrieve', (request, response) => {
  //get message which in room has _id = request.body._id

  Chat.find({ in: request.body._id }).then(result => {
    response.send(result)
  })
})

module.exports = router