const Blog = require('../models/Blog')
const User = require('../models/User')

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

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = { initialBlogs, blogsInDb, usersInDb }