const express = require('express')

const User = require('../models/user.model')
const Room = require('../models/room.model')
const Chat = require('../models/chat.model')
const Reaction = require('../models/reaction.model')
const {React, getReactionsByMessage} = require('../models/React')

const router = express.Router()

router.post('/retrieve', (request, response) => {
    React.find({ react_at: request.body.id }).then(result => {
        const reactions = getReactionsByMessage(result)
        response.send(reactions)
    })
})

module.exports = router