const mongoose = require('mongoose')

const attendSchema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    room_id: mongoose.Schema.Types.ObjectId
})

const Attend = mongoose.model('Attend', attendSchema, 'attend')

module.exports = Attend