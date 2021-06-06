module.exports = function(app, io){
    require('./auth.api')(app, io);
    require('./mun.api')(app, io);
    require('./booking.api')(app, io);
}