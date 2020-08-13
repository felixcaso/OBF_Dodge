



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

io.sockets.on('connection',
    // We are given a websocket object in our function
    function (socket) {

//io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('register_user',
        function(data) {
            var unique_username = data.unique_username;
            dodgeDB.insertOne({
                username: unique_username
            }, function (err, result) {
                if (err) throw err;
            });
        }
    );

    socket.on('register_score',
        function(data) {
            console.log('register score on server')
            var unique_username = data.unique_username;
            var score = data.score;
            dodgeDB.insertOne({
                username: unique_username,
                score: score
            }, function (err, result) {
                if (err) throw err;
            });
        }
    );


    socket.on('get_scores', function(data) {
        dodgeDB.find( {} ).sort( { score: -1 }).toArray(
            function(err, result) {

            //console.log(result);
            //only send to client
            socket.emit('scores_from_db',result);

            if (err) throw err;
            });
    });

});