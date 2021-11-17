const express = require('express')

const User = require('../models/user.model')

const router = express.Router()

router.get('/find', (request, response) => {
    User.findOne({_id: request.cookies.userId}).then((user) => {
      response.send(user)
    })
})

//ok
router.get('/logout', (request, response) => {
    response.clearCookie('userId')
    response.send()
})

router.post('/signin', (request, response) => {
    const result = {
      username: request.body.username,
      password: request.body.password,
      color: Math.floor(Math.random() * 16777215).toString(16)
    }

    const newUser = new User(result)
    newUser.save((err, result) => {
      if(err) return handleError(err)
    })
  
    response.send({valid: true})
})

//ok
router.post('/login', (request, response) => {
    const result = {
      username: request.body.username,
      password: request.body.password
    }

    User.findOne({ username: result.username, password: result.password }).then(result => {
      if(result)
        response.cookie('userId', result._id)
      response.send(result)
    })
})

module.exports = router