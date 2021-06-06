require('./models')
const express = require('express');
const socket = require('socket.io');
const app = express();
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

var server = app.listen(PORT, () => {
    console.log("Express server started on port " + PORT);
});

var io = socket(server)

require('./api')(app, io)

app.use(express.static(path.join(__dirname, 'public')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})
