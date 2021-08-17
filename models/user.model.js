const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    rooms: [{roomId: String}]
})

const User = mongoose.model('User', userSchema, 'user')

module.exports = User