var crawler = require('../UofT-TimeTableCrawler/crawler');
var results = crawler.crawl();
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        results.then(function(timetablesJSON) {
            console.log('waiting for crawler');
            socket.emit('chat message', timetablesJSON);
        }).catch( function(error) {
            console.log("error from cralwer: " + error);
            socket.emit('crawler error');
        });
    });
    socket.on('iOS', function(msg) {
        console.log('iOS connected');
        results.then(function(timetablesJSON) {
            console.log('waiting for crawler');
            socket.emit('iOS', timetablesJSON);
        }).catch(function(error) {
            console.log("error from cralwer: " + error);
            socket.emit('crawler error');
        })
    });
});

server.listen(3000, function() {
    console.log('listening on port 3000...');
});