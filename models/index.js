const mongoose = require('mongoose');
const config = require('../config.json')

const username = config.username
const password = config.password
const dbName = config.dbName

var url = `mongodb+srv://${username}:${password}@cluster0.nfyas.mongodb.net/${dbName}`

mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify: false, useCreateIndex: true }, (err)=>{
    if(!err){
        console.log("Database connected...");
    }else{
        console.log("Error in connecting to Database", JSON.stringify(err));
    }
});

require('./users.model');
require('./muns.model');
require('./bookings.model');