const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);
let players = [];

// User Connection handlers
io.on('connection', function(socket) {
    console.log("A user connected: " + socket.id);
    // So we know who plays right now
    players.push(socket.id);

    // Not really needed later, but just here for testing
    if (players.length === 1) {
        io.emit('isPlayerA');
    };

    socket.on('dealCards', function() {
        io.emit('dealCards');
    });

    socket.on('cardPlayed', function(gameObject, isPlayerA) {
        io.emit('cardPlayed', gameObject, isPlayerA);
    });

    //Remove socket from current players
    socket.on('disconnect', function() {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
    });
});


http.listen(3000, function() {
    console.log('Server started!');
});