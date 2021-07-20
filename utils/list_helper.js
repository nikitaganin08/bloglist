const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
    return blogs.reduce((first, second) => first.likes > second.likes ? first : second)
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}