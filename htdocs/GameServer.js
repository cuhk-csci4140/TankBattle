'use strict';
// ============ Contants Declarations ==============
// message types
var PLAYER_READY = 0;
var START_GAME = 1;
var UPDATE_TANK_INFO = 2;
var END_GAME = 3;
var TANK_DESTROYED = 4;
var TANK_STATUS = 10;
var NEW_FIRE = 11;
var BOX_DESTROYED = 12;
var NEW_FOOD = 13;


var WebSocketServerClass = require('websocket').server; // websocket server class
var http = require('http');                             // http module
var clients = new Array();                              // client connections
var games = new Array();                                // array of games


// Game Class Definition
function Game(gameID, mapID, totalPlayers) {
    this.gameID = gameID;
    this.mapID = mapID;
    this.totalPlayers = totalPlayers;
    this.playerConns = new Array();
    this.readyPlayers = 0;
    this.livePlayers = 0;
}

// Check connection Allowance
function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

// find the game object with given game id
function findGameByID(id) {
    for(var i = 0; i < games.length; i++) {
        if(games[i].gameID == id) {
            return games[i];
        }
    }
    return false;
}

// find the game object with give client connection
function findGameWithConn(conn) {
    for(var i = 0; i < games.length; i++) {
        for(var j = 0; j < games[i].playerConns.length; j++) {
            if(games[i].playerConns[j] == conn)
                return games[i];
        }
    }
    return false;
}

// Remove a specific element in an array
function arrayRemoveItem(arr, item) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] == item) {
            arr.splice(i, 1);
            return;
        }
    }
}

// print server status
function printStatus() {
    console.log(' ');
    console.log('********Tank Online Websocket Server*********');
    console.log('Number of connections: ' + clients.length);
    console.log('Number of games: ' + games.length);
    for(var i = 0; i < games.length; i++) {
        console.log('Game ID: ' + games[i].gameID);
        console.log('Number of Players: ' + games[i].playerConns.length);
        for(var j = 0; j < games[i].playerConns.length; j++) {
            console.log('Player ' + (j+1) + ': ' + games[i].playerConns[j].remoteAddress);
        }
        console.log(' ');
    }
}

// Create HTTP Server
var httpServer = http.createServer(function(request, response) {
    console.log('Received request for ' + request.url);
    response.writeHead(200, {'Content-Type':'text/plain'});
    response.write('Welcome to Tank Online Websocket Server.');
    response.end();
});
httpServer.listen(8889, function() {
    console.log('Tank Online Websocket Server is listening on port 8889.');
});

// Create Websocket Server
var wsServer = new WebSocketServerClass({
    httpServer: httpServer,
    autoAcceptConnections: false
});

// Connection request handling
wsServer.on('request', function(request) {

    // Check connecton allowance
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log('Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    // Create client connection
    var connection = request.accept(null, request.origin);
    clients.push(connection);
    console.log('Client connection accepted. (' + connection.remoteAddress + ')');

    // When message received from client connection
    connection.on('message', function(message) {
        var data = JSON.parse(message.utf8Data);
        var msgType = data[0];
        var gameID = data[1];
        var msg = data[2];
        var game = findGameByID(gameID);

        switch(msgType)
        {
            case PLAYER_READY: // player ready message
                var mapID = msg[0];
                var totalPlayers = msg[1];

                // game not create yet, create the game object
                if (!game) {
                    game = new Game(gameID, mapID, totalPlayers);
                    games.push(game);
                    console.log('New game created. Game id : ' + gameID);
                }

                game.playerConns.push(connection);
                game.readyPlayers++;
                console.log('Player(' + connection.remoteAddress + ') join game(' + gameID + ').' );

                // all players are ready, send start game message
                if (game.readyPlayers == game.totalPlayers) {
                    game.livePlayers = game.readyPlayers;
                    for (var index in game.playerConns) {
                        game.playerConns[index].send(JSON.stringify([START_GAME]));
                    }
                    console.log('Game(' + gameID + ') started.' );
                    printStatus();
                }
                break;

            case UPDATE_TANK_INFO: // update tank info message
                if (game) {
                    for (var i = 0; i < game.playerConns.length; i++) {
                        if (game.playerConns[i] != connection) {
                            game.playerConns[i].send(message.utf8Data);
                        }
                    }
                }

                break;

            case TANK_DESTROYED:
                if (game) {
                    game.livePlayers--;
                    if (game.livePlayers <= 1) {
                        // end the game if there is only 1 live tank
                        for (var i = 0; i < game.playerConns.length; i++) {
                            game.playerConns[i].send(JSON.stringify([END_GAME]));
                        }

                        // remove the game
                        arrayRemoveItem(games, game);
                    }
                }
                break;

        }
    });

    // When client disconnected
    connection.on('close', function(reasonCode, description) {
        arrayRemoveItem(clients, connection);
        console.log('Client disconnected. (' + connection.remoteAddress + ')');

        var game = findGameWithConn(connection);
        if(game) {
            arrayRemoveItem(game.playerConns, connection);
            game.totalPlayers--;
            if(game.totalPlayers <= 1) {

                // end the game if there is only one player in the game
                if (game.totalPlayers == 1) {
                    game.playerConns[0].send(JSON.stringify([END_GAME]));
                }

                arrayRemoveItem(games, game);
                console.log('Game ended. Game id: ' + game.gameID);
            }
        }

        printStatus();
    });

});