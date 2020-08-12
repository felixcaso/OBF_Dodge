var hostname = '0.0.0.0';
var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
const path = require('path');
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