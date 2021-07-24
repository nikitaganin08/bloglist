const Blog = require('../models/Blog')

const initialBlogs = [
    {
        title: 'Journey',
        author: 'Joe Peshy',
        url: 'livejournal.ru/journey',
        likes: 2
    },
    {
        title: 'Sweet Home',
        author: 'Marty Ross',
        url: 'livejournal.ru/sweethome',
        likes: 3
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, blogsInDb }