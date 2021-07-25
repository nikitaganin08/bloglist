const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/User')

userRouter.get('/', async (request, response, next) => {
    try {
        const users = await User.find({})
            .populate('blogs', { author: 1, title: 1, url: 1 })
        response.json(users)
    } catch (exception) {
        next(exception)
    }
})

userRouter.post('/', async (request, response, next) => {
    const body = request.body

    if (!body.password || body.password.length < 3) {
        return response.status(404).json({
            error: 'password is missing or length is less than 3'
        })
    }

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
