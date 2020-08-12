



// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
var hostname = '0.0.0.0';
var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
const path = require('path');

var mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

//var uri = 'mongodb://noaru_user:noarupw1@ds135217.mlab.com:35217/noaru?connectTimeoutMS=300000';
var uri = 'mongodb://dodgeuser:florence1@ds329058.mlab.com:29058/obf';
var dodgeDB;

MongoClient.connect(uri, function (err, client) {
    if (err) throw err;
    dodgeDB = client.db('obf').collection('dodge');
});
app.use(express.static(__dirname));
//app.use('/', express.static(path.join(__dirname, 'public')))
//app.use('/', express.static(path.join(__dirname, '/build/default')));
//app.use(express.static('./build/default'));


var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

server.listen(port, hostname, function () {
    console.log('listening on ' + hostname + ':' + port);
});

io.on('connection', (socket) => {
    console.log('a user connected');
});