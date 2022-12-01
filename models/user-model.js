const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    projects: {
        type: [{
            id: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            image: {
                type: String,
            }
        }],

        default: []
    }
})

const User = mongoose.model('uptrade-user', UserSchema)

module.exports = User