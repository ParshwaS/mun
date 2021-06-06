const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    mobile: {
        type: Number,
    },
    DOB: Date,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'User'
    }
})

mongoose.model('user', UserSchema, 'users')