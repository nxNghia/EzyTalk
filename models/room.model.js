const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    room_name: String,
    short_id: String,
    public: Boolean,
    members: [{
        userId: String
    }],
    conversations: [{
        textId: String
    }]
})

const Room = mongoose.model('Room', roomSchema, 'room')

module.exports = Room