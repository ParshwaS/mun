const mongoose = require('mongoose')

const FeedbackSchema = new mongoose.Schema({
    user: String,
	satisfaction: Number,
	future: Number,
	recommend: Number,
	hearFrom: String,
	feedback: String
})

mongoose.model('feedback', FeedbackSchema, 'feedbacks')