const mongoose = require('mongoose')

const MUNSchema = new mongoose.Schema({
    name: String,
    city: String,
    startDate: Date,
    endDate: Date,
    duration: String,
    desc: String,
    venue: {
        title: String,
        long: Number,
        lat: Number
    },
    media: [
        {
            type: String,
            link: String
        }
    ],
    deadline: Date,
    itinerary: String,
    committees: [
        {
            title: String,
            agendas: [
                String
            ],
            level: String,
            vacancy: Number,
            seat: Number,
            occupied: Number,
            shortName: String,
            desc: String,
            media: [
                {
                    type: String,
                    link: String
                }
            ]
        }
    ],
    organizer_contact: {
        instagram: String,
        facebook: String,
        website: String,
        phone: String,
        email: String
    }
})

mongoose.model('mun', MUNSchema, 'muns')