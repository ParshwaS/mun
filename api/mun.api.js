const mongoose = require('mongoose')
const config = require('../config.json')
const jwt = require('jsonwebtoken')
const MUN = mongoose.model('mun')
const Booking = mongoose.model('booking')

module.exports = function (app, io) {
	app.get('/mun/list/city', (req, res) => {
		var decoded = false;
		if (req.headers.Authorization) {
			decoded = jwt.verify(req.headers.Authorization, config.secret);
		}
		var city = decoded ? decoded.city : (req.body.city || "Ahmedabad");
		MUN.find({
			city: city
		}).lean().then((docs) => {
			res.json({ status: true, data: docs })
		}).catch((error) => {
			res.json({ status: false, error: { error_cd: "DB100", message: "Internal Server Error" } })
		})
	});

	app.get('/mun/list/popular', (req, res) => {
		var decoded = false;
		if (req.headers.Authorization) {
			decoded = jwt.verify(req.headers.Authorization, config.secret);
		}
		var city = decoded ? decoded.city : (req.body.city || "Ahmedabad");
		MUN.find({
			city: city
		}).lean().then((docs) => {
			res.json({ status: true, data: docs })
		}).catch((error) => {
			res.json({ status: false, error: { error_cd: "DB100", message: "Internal Server Error" } })
		})
	});

	app.get('/mun/bookings', (req, res)=>{
		var decoded = false;
		if (req.headers.Authorization) {
			decoded = jwt.verify(req.headers.Authorization, config.secret);
			Booking.find({
				"details.user": decoded._id,
				paid: true
			}).lean().then((docs)=>{
				res.json({status: true, data: docs});
			}).catch((error)=>{
				res.json({status: false, error: {error_cd: "DB100", message: "Internal Server Error"}});
			})
		}else{
			res.json({status: false, error: {error_cd: "AUTH100", message: "Auth Token Failed"}})
		}
	});

	app.get('/mun/briefcase', (req, res)=>{
		var decoded = false;
		if (req.headers.Authorization) {
			decoded = jwt.verify(req.headers.Authorization, config.secret);
			Booking.find({
				"details.user": decoded._id,
				paid: false
			}).lean().then((docs)=>{
				res.json({status: true, data: docs});
			}).catch((error)=>{
				res.json({status: false, error: {error_cd: "DB100", message: "Internal Server Error"}});
			})
		}else{
			res.json({status: false, error: {error_cd: "AUTH100", message: "Auth Token Failed"}})
		}
	});
}