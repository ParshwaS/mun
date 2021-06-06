const mongoose = require('mongoose')
const config = require('../config.json')
const jwt = require('jsonwebtoken')
const Feedback = mongoose.model('feedback')

module.exports = function (app, io) {
	app.post('/api/feedback/add', (req, res)=>{
		var decoded = false;
		if (req.headers.Authorization) {
			decoded = jwt.verify(req.headers.Authorization, config.secret);
			var feed = new Feedback(req.body);
			feed.save().then((doc)=>{
				res.json({
					status: true,
					data: { message: "Your feedback is registered successfully." }
				})
			}).catch((error)=>{
				res.json({status: false, error: {error_cd: "DB100", message: "Internal Server Error"}});
			})
		}else{
			res.json({status: false, error: {error_cd: "AUTH100", message: "Auth Token Failed"}})
		}
	});
}