const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    text: String,
    from: {
        id: String,
        name: String
    },
    reactions: [{
        reactionType: String,
        users: [{
            userId: String
        }]
    }]
})

const Chat = mongoose.model('Chat', chatSchema, 'chat')

module.exports = Chat