const mongoose = require('mongoose')
const config = require('../config.json')
const jwt = require('jsonwebtoken')
const MUN = mongoose.model('mun');
const Booking = mongoose.model('booking')

module.exports = function (app, io) {

	app.post('/bookings/new', (req, res) => {
		var decoded = false;
		if (req.headers.Authorization) {
			decoded = jwt.verify(req.headers.Authorization, config.secret);
			var booking = new Booking({...req.body, "details.user": decoded._id});
			booking.save().then((doc) => {
				res.json({
					status: true,
					data: { message: "Your booking is saved successfully." }
				})
			}).catch((error)=>{
				res.json({status: false, error: {error_cd: "DB100", message: "Internal Server Error"}});
			})
		}else{
			res.json({status: false, error: {error_cd: "AUTH100", message: "Auth Token Failed"}})
		}
	});

	app.post('/bookings/modify', (req, res)=>{
		var decoded = false;
		if (req.headers.Authorization) {
			decoded = jwt.verify(req.headers.Authorization, config.secret);
			Booking.update({_id: req.body.id}, {...req.body}).then((docs)=>{
				if(docs.n > 0){
					res.json({status: true, data: {message: "Your booking has been updated successfully"}});
				}else{
					res.json({status: false, data: {error_cd: "BK404", message: "No such booking found"}});
				}
			})
		}else{
			res.json({status: false, error: {error_cd: "AUTH100", message: "Auth Token Failed"}})
		}
	});

	app.post('/bookings/pay', (req, res)=>{
		var decoded = false;
		if (req.headers.Authorization) {
			decoded = jwt.verify(req.headers.Authorization, config.secret);
			Booking.update({_id: req.body.id}, {paid: true}).then((docs)=>{
				if(docs.n > 0){
					Booking.findById(req.body.id).then((doc)=>{
						MUN.find({mun: doc.mun, "committees._id": doc.committee}).then((mun)=>{
							var newVac;
							mun.committees.forEach((el)=>{
								if(el._id == doc.committee){
									el.occupied += 1;
									el.vacancy -= 1;
									newVac = el.vacancy;
								}
							})
							if(newVac < 0){
								res.json({status: false, error: {error_cd: "FL100", message: "This committee in this MUN is already full."}});
							}else{
								io.emit(doc.committee._id+'-update', newVac);
								mun.save().then((doc)=>{
									res.json({status: true, data: {message: "Your booking has been paid"}});
								})
							}
						})
					}).catch((error)=>{
						res.json({status: false, data: {error_cd: "BK404", message: "No such booking found"}});
					})
				}else{
					res.json({status: false, data: {error_cd: "BK404", message: "No such booking found"}});
				}
			})
		}else{
			res.json({status: false, error: {error_cd: "AUTH100", message: "Auth Token Failed"}})
		}
	});
}