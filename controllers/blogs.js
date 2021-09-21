const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const { userExtractor, tokenExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({})
            .populate('user', { username: 1, name: 1 })
        response.json(blogs)
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response, next) => {
    const body = request.body
    try {
        const user = request.user

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id
        })

        const savedBlog = await (await blog.save()).populate('user')
            .execPopulate()
        user.blogs = user.blogs.concat(savedBlog)
        await user.save()
        response.status(201).send(savedBlog.toJSON())
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)
        const user = request.user
        if (blog.user.toString() !== user.id) {
            return response.status(403).send({ error: 'deletion forbidden' })
        }

        await Blog.deleteOne(blog)
        response.status(204).send()
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true })
            .populate('user', { username: 1, name: 1 })
        response.json(updatedBlog.toJSON())
    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter