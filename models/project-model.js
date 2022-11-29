const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ProjectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    queue: {
        type: [],
        required: true,
        default: []
    },
    development: {
        type: [],
        required: true,
        default: []
    },
    done: {
        type: [],
        required: true,
        default: []
    },
    taskNum: {
        type: Number,
        required: true,
        default: 0
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('uptrade-project', ProjectSchema)