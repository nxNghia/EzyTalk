const express = require('express')

const User = require('../models/user.model')
const Room = require('../models/room.model')
const Chat = require('../models/chat.model')

const router = express.Router()

router.post('/retrieve', (request, response) => {
    Room.findOne({_id: request.body._id}).then(room => {
      if(room)
      {
        const promises = []
        room.conversations.forEach(conversation => {
          const sub_promise = new Promise((resolve, reject) => {
            Chat.findOne({_id: conversation.textId}).then(result => {
                resolve(result)
            })
          })
          promises.push(sub_promise)
        })
  
        Promise.all(promises).then(result => {
          response.send(result)
        })
      }
    })
})

module.exports = router