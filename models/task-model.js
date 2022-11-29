const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TaskSchema = new Schema({
    num: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    movedToDevelopment: {
        type: Date
    },
    developmentTime: {
        type: Number,
        default: 0
    },
    dateDone: {
        type: Date,
    },
    priority: {
        type: Number,
        default: 1
    },
    files: {
        type: [{
            link: {
                type: String,
                required: true
            }
        }],
        default: []
    },
    status: {
        type: String,
        required: true,
        default: 'queue'
    },
    subtasks: {
        type: [{
            title: {
                type: String,
                required: true
            },
            isDone: {
                type: Boolean,
                required: true,
                default: false
            }
        }]
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('uptrade-task', TaskSchema)