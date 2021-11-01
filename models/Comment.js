const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const commentSchema = new mongoose.Schema({
    comment: { type: String, required: true, minlength: 1 },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }
})

commentSchema.plugin(uniqueValidator)

commentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Comment', commentSchema)