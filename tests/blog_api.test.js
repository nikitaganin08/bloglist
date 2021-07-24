const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/Blog')
const app = require('../app')
const api = supertest(app)
const blogHelper = require('./test_helper')
const baseUrl = '/api/blogs'

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObjects = blogHelper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('when there is initially blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api.get(baseUrl)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs returned ', async () => {
        const response = await api.get(baseUrl)

        expect(response.body).toHaveLength(blogHelper.initialBlogs.length)
    })

    test('specific blog was returned', async () => {
        const response = await api.get(baseUrl)
        const titles = response.body.map(blog => blog.title)

        expect(titles).toContain('Journey')
    })

    test('property of _id renamed to id', async () => {
        const response = await api.get(baseUrl)
            .expect(200)
        expect(response.body[0].id).toBeDefined()
        expect(response.body[0]._id).not.toBeDefined()
    })
})

describe('addition of a new blog', () => {
    test('add valid blog', async () => {
        const newBlog = {
            title: 'New blog',
            author: 'Adam Wome',
            url: 'livejournal.ru/newblog',
            likes: 0
        }

        await api.post(baseUrl)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogs = await blogHelper.blogsInDb()
        expect(blogs).toHaveLength(blogHelper.initialBlogs.length + 1)

        const blogsTitle = blogs.map(blog => blog.title)
        expect(blogsTitle).toContain(newBlog.title)
    })

    test('cannot add valid blog', async () => {
        const newBLog = {
            title: 'New',
            url: 'google.com/new'
        }

        await api.post(baseUrl)
            .send(newBLog)
            .expect(400)

        const blogs = await blogHelper.blogsInDb()
        expect(blogs).toHaveLength(blogHelper.initialBlogs.length)
    })

    test('missing likes set to \'zero\' on addition', async () => {
        const newBLog = {
            title: 'New',
            author: 'John New',
            url: 'google.com/new',
        }

        const response = await api.post(baseUrl)
            .send(newBLog)
            .expect(201)

        expect(response.body.likes).toEqual(0)
    })
})

describe('deletion on the blog', () => {
    test('succeeds with status 204 if id is valid', async () => {
        const blogs = await blogHelper.blogsInDb()
        const blogToDelete = blogs[0]

        await api.delete(`${baseUrl}/${blogToDelete.id}`)
            .expect(204)
        const blogsAfterDelete = await blogHelper.blogsInDb()

        expect(blogsAfterDelete).toHaveLength(blogHelper.initialBlogs.length - 1)
    })

    test('error with status 400 if id is not valid', async () => {
        await api.delete(`${baseUrl}/5a3d5da59070081a82a3445`)
            .expect(400)
        const blogsAfterDelete = await blogHelper.blogsInDb()

        expect(blogsAfterDelete).toHaveLength(blogHelper.initialBlogs.length)
    })
})

describe('updating of blog', () => {
    test('succeeds with valid id', async () => {
        const blogs = await blogHelper.blogsInDb()
        const blogToUpdate = { ...blogs[0], title: 'Updated title' }

        const response = await api.put(`${baseUrl}/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200)

        expect(response.body.title).toEqual(blogToUpdate.title)
    })
    test('error with not valid id', async () => {
        const blogs = await blogHelper.blogsInDb()
        const blogToUpdate = { ...blogs[0], title: 'Updated title' }

        await api.put(`${baseUrl}/5a3d5da59070081a82a3445`)
            .send(blogToUpdate)
            .expect(400)

    })
})

afterAll(() => mongoose.connection.close())