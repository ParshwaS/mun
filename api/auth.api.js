const mongoose = require('mongoose')
const config = require('../config.json')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = mongoose.model('user')

module.exports = function (app, io) {

	app.post('/api/auth/login', (req, res) => {
		User.findOne({
			email: req.body.email
		}).lean().then((doc)=>{
			if(bcrypt.compareSync(req.body.password, doc.password)){
				var payload = {
					_id: doc._id,
					name: doc.name,
					email: doc.email,
					role: doc.role
				}
				var token = jwt.sign(payload, config.secret, {})
				res.json({status: true, data: {token}})
			}else{
				res.json({status: false, error: {error_cd: "AUTH100", message: "We cannot authorize this account"}})
			}
		}).catch((err)=>{
			res.json({status: false, error: {error_cd: "DB100", message: "Internal Server Error"}})
		})
	})

	app.post('/api/auth/register', (req, res) => {
		if(!req.body.role){
			req.body.role = "User";
		}
		const user = new User({
			_id: req.body.id,
			role: req.body.role,
			name: req.body.name,
			email: req.body.email
		})
		bcrypt.hash(req.body.password, 12).then((hash) => {
			user.password = hash
			user.save().then((doc) => {
				res.json({ status: true, data: doc })
			}).catch((err) => {
				res.json({ status: false, error: {error_cd: "DB100", message: "Internal Server Error"} })
			})
		}).catch((err) => {
			res.json({ status: false, error: {error_cd: "HS100", message: "Error in storing password"} })
		})
	})

	// app.get('/api/auth/refresh', (req,res)=>{
	// 	const decoded = jwt.verify(req.headers['authorization'], config.secret);
	// 	var payload = {
	// 		_id: decoded._id,
	// 		name: decoded.name,
	// 		role: decoded.role,
	// 		email: decoded.email
	// 	}
	// 	var token = jwt.sign(payload, config.secret, {
	// 		expiresIn: '1h'
	// 	})
	// 	res.json({status: true, data: {token}})
	// })

	app.get('/api/auth/profile', (req,res)=>{
		const decoded = jwt.verify(req.headers['authorization'], config.secret);
		User.findById(decoded._id).lean().then((doc)=>{
			if(!doc){
				res.json({status: false, error: {error_cd: "AUTH100", message: "Auth token failed!"}})
			}else{
				res.json({status: true, data: doc});
			}
		}).catch((error)=>{
			res.json({status:false, error: {error_cd: "DB100", message: "Internal Server Error"}});
		})
	})

	app.get('/api/auth/getOTP', (req, res)=>{
		const decoded = jwt.verify(req.headers['authorization'], config.secret);
		User.findById(decoded._id).then((doc)=>{
			if(!doc){
				res.json({status: false, error: {error_cd: "AUTH100", message: "Auth token failed!"}});
			}else{
				var otp = Math.ceil(Math.random() * 100000);
				if(otp == 100000){
					otp = 99999;
				}
				while (otp < 10000) {
					otp *= 10;
				}
				doc.otp = otp;
				doc.save();
				res.json({status: true, data: {message: "OTP has sent to your registered mail."}});
			}
		}).catch((error)=>{
			res.json({status:false, error: {error_cd: "DB100", message: "Internal Server Error"}});
		});
	})

	app.post('/api/auth/verifyOTP', (req, res)=>{
		const decoded = jwt.verify(req.headers['authorization'], config.secret);
		User.findById(decoded._id).then((doc)=>{
			if(!doc){
				res.json({status: false, error: "Auth token failed!"});
			}else{
				if(doc.otp == req.body.otp){
					res.json({status: true, data: {message: "Verified Successfully"}});
				}else{
					res.json({status: false, error: {error_cd: "AUTH101", message: "Invalid OTP"}});
				}
			}
		}).catch((error)=>{
			res.json({status:false, error: {error_cd: "DB100", message: "Internal Server Error"}});
		});
	})

	app.post('/api/auth/updatePass', (req, res)=>{
		const decoded = jwt.verify(req.headers['authorization'], config.secret);
		User.findById(decoded._id).then((doc)=>{
			if(!doc){
				res.json({status: false, error: "Auth token failed!"});
			}else{
				if(doc.otp == req.body.otp){
					doc.password = bcrypt.hashSync(req.body.password, 12);
					doc.save();
					res.json({status: true, data: {message: "Verified Successfully"}});
				}else{
					res.json({status: false, error: {error_cd: "AUTH101", message: "Invalid OTP"}});
				}
			}
		}).catch((error)=>{
			res.json({status:false, error: {error_cd: "DB100", message: "Internal Server Error"}});
		});
	})

}