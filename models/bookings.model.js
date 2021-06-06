const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
    mun: {
        type: mongoose.Types.ObjectId,
        ref: 'muns'
    },
    committee: {
        type: String
    },
    details: {
        user: String,
        food_pref: String,
        institute: String,
        city: String,
        accomodation: Boolean,
        premium: Boolean
    },
    paid: {
        type: Boolean,
        default: false
    }
})

mongoose.model('booking', BookingSchema, 'bookings')