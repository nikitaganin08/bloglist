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

test('blogs are returned as json', async () => {
    await api.get(baseUrl)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs returned ', async () => {
    const response = await api.get(baseUrl)
        .expect(200)
    expect(response.body).toHaveLength(blogHelper.initialBlogs.length)
})

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

test('property named id', async () => {
    const response = await api.get(baseUrl)
        .expect(200)
    expect(response.body[0].id).toBeDefined()
    expect(response.body[0]._id).not.toBeDefined()
})

test('missing likes set to 9', async () => {
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

afterAll(() => mongoose.connection.close())