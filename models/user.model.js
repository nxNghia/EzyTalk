const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    color: String,
})

const User = mongoose.model('User', userSchema, 'user')

module.exports = User