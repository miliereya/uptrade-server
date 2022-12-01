const { timeStamp } = require('console')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CommentSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    text: {
        type: String,
        require: true
    },
    children: {
        type: [{
            type: String
        }],
        default: []
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('test-uptrade-comments', CommentSchema)