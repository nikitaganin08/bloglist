const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/User')

userRouter.get('/', async (request, response) => {
    User.find({})
        .then(users => response.json(users))
})

userRouter.post('/', async (request, response, next) => {
    const body = request.body

    const saltRound = 10
    const passwordHash = await bcrypt.hash(body.password, saltRound)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    try {
        const savedUser = await user.save(user)
        response.status(201).json(savedUser)
    } catch (exception) {
        next(exception)
    }
})

module.exports = userRouter