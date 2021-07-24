const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/User')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const baseUrl = '/api/users'

beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'root root', passwordHash })
    await user.save()
})

describe('getting users', () => {
    test('blogs are returned as json', async () => {
        const response = await api.get(baseUrl)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blohsInDb = await helper.usersInDb()

        expect(response.body).toHaveLength(blohsInDb.length)
    })
})

describe('adding user tests', () => {


    test('succeed in adding new user', async () => {
        const usersInDb = await helper.usersInDb()
        const newUser = {
            username: 'nikitaganin',
            name: 'Nikita Ganin',
            password: 'q123'
        }

        await api.post(baseUrl)
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAfterAdding = await helper.usersInDb()

        expect(usersAfterAdding).toHaveLength(usersInDb.length + 1)
    })

    test('error while adding existing user', async () => {
        const usersInDb = await helper.usersInDb()
        const newUser = {
            username: 'root',
            name: 'Nikita',
            password: 'q123'
        }

        const result = await api.post(baseUrl)
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAfterAdding = await helper.usersInDb()
        expect(usersAfterAdding).toHaveLength(usersInDb.length)
    })
})

afterAll(() => mongoose.connection.close())
