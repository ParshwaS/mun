const mongoose = require('mongoose')

const CitySchema = new mongoose.Schema({
    name: String    
})

mongoose.model('city', CitySchema, 'cities')