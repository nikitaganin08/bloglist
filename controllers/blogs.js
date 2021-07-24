const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')

blogsRouter.get('/', async (request, response) => {
    Blog.find({})
        .then(blogs => response.json(blogs))
})

blogsRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body)

    try {
        const savedNote = await blog.save()
        response.status(201).send(savedNote.toJSON())
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).send()
    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter