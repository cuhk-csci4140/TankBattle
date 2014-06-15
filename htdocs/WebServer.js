//Battle Tank game lobby/room Websocket Server

var WebSocketServer = require('websocket').server;
var http = require('http');
var url = require("url");
var querystring = require("querystring");

var clients = new Array(); // client connections
var uid_array = new Array(); // user id of clients
var game_rooms = new Array(); // game room , will be passed between client and server
var in_rooms = new Array(); // connection inside game room
var rooms_connections = new Array(); // connection of each game room

var server = http.createServer(function(request, response) {
    console.log('Received request for ' + request.url);
    response.writeHead(200, {'Content-Type':'text/plain'});
    response.write('Welcome to Battle Tank Websocket Server');
    response.end();
});

server.listen(8888, function() {
    console.log('Web Server is listening on port 8888');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

// print server status
function printStatus()
{
	console.log('');
    console.log('********Battle Tank lobby/room Websocket*********');
    console.log('Number of connections: ' + clients.length);
	console.log('Number of connections in game room: ' + in_rooms.length);
	
	for(var i=0; i<uid_array.length; i++) {
		console.log("uid : " + uid_array[i]);
	}
	console.log('');
	for(var i=0; i<game_rooms.length; i++)
		console.log("room id is " + game_rooms[i].id);

	//console.log(JSON.stringify(["aaa", [0, "Ddd", 11]]));
}

function printGameRoomStatus(roomID, arr_index, conn_index) {
	console.log("");
	for (var i=0; i<game_rooms[arr_index].members.length; i++)
	{
		console.log("in room " + roomID + " : " + game_rooms[arr_index].members[i].uid);
	}
	console.log("in room " + roomID + " rooms_connections are " + rooms_connections[conn_index].connect.length);
}

// Remove a specific element in an array
function arrayRemoveItem(arr, item)
{
    for(var i = 0; i < arr.length; i++)
      if(arr[i] == item)
      {
          arr.splice(i, 1);
          return;
      }
}

// Remove a specific element in rooms array
function objArrayRemoveItem(arr, host)
{
    for(var i = 0; i < arr.length; i++)
      if(arr[i].host == host)
      {
          arr.splice(i, 1);
          return;
      }
}

// Remove a member in room
function removeMember(arr, index)
{
	arr.splice(index, 1);
	return;
}

// Remove a room_connect obj in rooms_connections
function removeRoomConnect(arr, roomID)
{
    for(var i = 0; i < arr.length; i++)
      if(arr[i].roomID == roomID)
      {
          arr.splice(i, 1);
          return;
      }
}

// Remove a connect in room_connect obj in rooms_connections
function removeConnectInRoomConnect(arr, roomID, connection)
{
    for(var i = 0; i < arr.length; i++)
      if(arr[i].roomID == roomID)
      {
		for(var j=0; j<arr[i].connect.length; j++) {
			if (arr[i].connect[j] == connection) {
			  arr[i].connect.splice(j, 1);
			  return;
			}
		}
      }
}

// check which room of host
function checkWhichRoomOfHost(uid)
{
    for(var i = 0; i < game_rooms.length; i++)
      if(game_rooms[i].host == uid)
      {
          return game_rooms[i].id;
      }
}

// check room host
function checkUidIsRoomHost(uid)
{
    for(var i = 0; i < game_rooms.length; i++)
      if(game_rooms[i].host == uid)
      {
          return true;
      }
	return false;
}

// get index of game_rooms by roomID
function getIndexByRoomID(roomID)
{
    for(var i = 0; i < game_rooms.length; i++)
      if(game_rooms[i].id == roomID)
      {
          return i;
      }
}

// get index of member in room by uid
function getMemberIndexByuid(members, uid)
{
    for(var i = 0; i < members.length; i++)
      if(members[i].uid == uid)
      {
          return i;
      }
}

// get index of connect in room by rmid
function getConnectIndexByRmid(arr, rmid)
{
    for(var i = 0; i < arr.length; i++)
      if(arr[i].roomID == rmid)
      {
          return i;
      }
}

function checkRoomExistByRmid(arr, rmid)
{
    for(var i = 0; i < arr.length; i++)
      if(arr[i].roomID == rmid)
      {
          return true;
      }
	return false;
}

// get index of uid array by uid
function getArrayIndex(arr, uid)
{
    for(var i = 0; i < arr.length; i++)
      if(arr[i] == uid)
      {
          return i;
      }
}

// check a uid if it is in any game room
function findPlayerInRoom(game_rooms, uid) {
	for(var i=0; i<game_rooms.length; i++) {
	  for (var j=0; j<game_rooms[i].members.length; j++) {
		if (game_rooms[i].members[j].uid == uid) {
			return {mem_index: j, room: game_rooms[i]};
		}
	  }
	}
	return null;
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


// Connection request handling
wsServer.on('request', function(request) {
    var uid;
	
    // Check connecton allowance
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log('Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    // Create client connection
    var connection = request.accept(null, request.origin);
	console.log("");
	//console.log("qs is " + querystring.parse(url.parse(request.resource).query)["id"]);
	if (url.parse(request.resource).pathname == "/room")
		in_rooms.push(connection);
	else
		clients.push(connection);
	printStatus();
	
	// When message received from client connection
    connection.on('message', function(message) {
        console.log('Received Message: ' + message.utf8Data);
		
		var data = JSON.parse(message.utf8Data);
		if (data[0] == "uid") {
			uid = data[1][0];
			uid_array.push(uid);
			
			for (var i=0; i<clients.length; i++) {
		      clients[i].send("[\"uid\"," + JSON.stringify(uid_array) + "]");  //update who is online
		    }
		}
		else if (data[0] == "chat") {
			for (var i=0; i<clients.length; i++) {
		      clients[i].send(JSON.stringify(data));  //boardcast the chat content
		    }
			//console.log(JSON.stringify(data));
		}
		else if (data[0] == "create_request") {
			uid = data[1][0];
			// check if uid is already a host
			var isHost = checkUidIsRoomHost(uid);
			if (!isHost) {
				var roomID = makeid();
				
				var room_conection = new Object();
				room_conection.roomID = roomID;
				room_conection.connect = new Array();
				rooms_connections.push(room_conection);
				
				var room = new Object();
				room.id = roomID;
				room.host = uid;
				room.name = "game room";
				room.members = new Array();
				room.status = "Waiting";
				
				game_rooms.push(room);
				connection.send("[\"create_response\",[\"" + roomID + "\"," + JSON.stringify(game_rooms) +"]]");
				
				//update the room list to all clients
				for (var i=0; i<clients.length; i++) {
		          clients[i].send("[\"room_list\"," + JSON.stringify(game_rooms) + "]"); 
				}
			}
			else {
				connection.send("[\"create_reject\",[]]");
			}
		}
		else if (data[0] == "room_list") {
			for (var i=0; i<clients.length; i++) {
		      clients[i].send("[\"room_list\"," + JSON.stringify(game_rooms) + "]");  //update the room list
		    }
		}
		else if (data[0] == "enter_room") { 
			uid = data[1][0];
			var roomID = data[1][1];
			
			// check if uid is host 
			var isHost = checkUidIsRoomHost(uid);
			var conn_index = getConnectIndexByRmid(rooms_connections, roomID);
			var arr_index = getIndexByRoomID(roomID);
			
			// ensure the room really exists
			var room_exist = checkRoomExistByRmid(rooms_connections, roomID);
			if (!room_exist) {
				connection.send("[\"room_not_exist\"]");
			}
			else {
			
			var result = findPlayerInRoom(game_rooms, uid);
			if (result !== null)  // means already in room
			{
				connection.send("[\"already_in_room\"]");
			}
			else {
			if (!isHost) {
				// update information of room
				var player = new Object();
				player.uid = uid;
				player.ready = "Not Ready";
				game_rooms[arr_index].members.push(player); // keep track the ready status of each player
				
				rooms_connections[conn_index].connect.push(connection); // keep the connection of member of this room
				
				printGameRoomStatus(roomID, arr_index, conn_index);
				
				if (game_rooms[arr_index].members.length == 3)
				  game_rooms[arr_index].status = "Full";
				else
				  game_rooms[arr_index].status = "Waiting";
				  
				//update the room list in lobby 
				for (var i=0; i<clients.length; i++) {
				  clients[i].send("[\"room_list\"," + JSON.stringify(game_rooms) + "]"); 
				}
				
				// acknowledge all room members including host
				for(var i=0; i<rooms_connections[conn_index].connect.length; i++)
				  rooms_connections[conn_index].connect[i].send("[\"not_host\"," + JSON.stringify(game_rooms[arr_index]) + "]");
				  
				/************** prepare start game ****************/
				// get index of host in members
				var host_index = getMemberIndexByuid(game_rooms[arr_index].members, game_rooms[arr_index].host);
				var start_game = true;
				// ensure all members are ready
				for (var i=0; i<game_rooms[arr_index].members.length; i++) {
					if (game_rooms[arr_index].members[i].ready == "Not Ready")
					{
					  start_game = false;
					  break;
					}
				}
				if (start_game)  // send message host of game room
				  rooms_connections[conn_index].connect[0].send("[\"start_game\"]");
				else
				  rooms_connections[conn_index].connect[0].send("[\"not_start_game\"]");
			}
			else {
				//console.log("cc cc " + JSON.stringify(game_rooms));
				rooms_connections[conn_index].connect.push(connection); // keep the connection of host of this room
				
				console.log("rooms_connections " + rooms_connections[0].roomID);
				connection.send("[\"is_host\"]");
			}
			}
			}
		}
		else if (data[0] == "ready_status") {  // wheun room member click ready status button
			var roomID = data[1][0];
			var r_uid = data[1][1];
			var r_status = data[1][2];
			
			var conn_index = getConnectIndexByRmid(rooms_connections, roomID)
			var rm_arr_index = getIndexByRoomID(roomID);
			var mem_arr_index = getMemberIndexByuid(game_rooms[rm_arr_index].members, r_uid);
			
			game_rooms[rm_arr_index].members[mem_arr_index].ready = r_status; // update ready status
			
			// acknowledge all room members including host
			for(var i=0; i<rooms_connections[conn_index].connect.length; i++)
			  rooms_connections[conn_index].connect[i].send("[\"not_host\"," + JSON.stringify(game_rooms[rm_arr_index]) + "]");
			
			/************** prepare start game ****************/
			// get index of host in members
			var host_index = getMemberIndexByuid(game_rooms[rm_arr_index].members, game_rooms[rm_arr_index].host);
			var start_game = true;
			// ensure all members are ready
			for (var i=0; i<game_rooms[rm_arr_index].members.length; i++) {
				if (game_rooms[rm_arr_index].members[i].ready == "Not Ready")
				{
				  start_game = false;
				  break;
				}
			}
			if (start_game)  // send message host of game room
			  rooms_connections[conn_index].connect[0].send("[\"start_game\"]");
			else
			  rooms_connections[conn_index].connect[0].send("[\"not_start_game\"]");
		}
		else if (data[0] == "kick") {
			var roomID = data[1][0];
			var k_uid = data[1][1];
			
			var conn_index = getConnectIndexByRmid(rooms_connections, roomID)
			var rm_arr_index = getIndexByRoomID(roomID);
			var mem_arr_index = getMemberIndexByuid(game_rooms[rm_arr_index].members, k_uid);
			
			// acknowledge the kicked member
			rooms_connections[conn_index].connect[mem_arr_index+1].send("[\"kicked\"]");

			// remove a connection in room_connect obj
			removeConnectInRoomConnect(rooms_connections, roomID, rooms_connections[conn_index].connect[mem_arr_index+1]);
			
			removeMember(game_rooms[rm_arr_index].members, mem_arr_index); // remove room member
			
			// acknowledge all room members including host
			for(var i=0; i<rooms_connections[conn_index].connect.length; i++)
			  rooms_connections[conn_index].connect[i].send("[\"not_host\"," + JSON.stringify(game_rooms[rm_arr_index]) + "]");
			  
			game_rooms[rm_arr_index].status = "Waiting";
					  
			//update the room list in lobby 
			for (var i=0; i<clients.length; i++) {
				clients[i].send("[\"room_list\"," + JSON.stringify(game_rooms) + "]"); 
			}
			
			/************** prepare start game ****************/
			// get index of host in members
			var host_index = getMemberIndexByuid(game_rooms[rm_arr_index].members, game_rooms[rm_arr_index].host);
			var start_game = true;
			// ensure all members are ready
			if (game_rooms[rm_arr_index].members.length == 0)
				start_game = false;
			else {
			  for (var i=0; i<game_rooms[rm_arr_index].members.length; i++) {
				if (game_rooms[rm_arr_index].members[i].ready == "Not Ready")
					{
						start_game = false;
						break;
					}
				}
			}
			if (start_game)  // send message host of game room
				rooms_connections[conn_index].connect[0].send("[\"start_game\"]");
			else
				rooms_connections[conn_index].connect[0].send("[\"not_start_game\"]");
			  
			printGameRoomStatus(roomID, rm_arr_index, conn_index);
		}
		else if (data[0] == "change_name") { // when room name is changed
			var roomID = data[1][0];
			var room_name = data[1][1];

			var rm_arr_index = getIndexByRoomID(roomID);
			var conn_index = getConnectIndexByRmid(rooms_connections, roomID)
			game_rooms[rm_arr_index].name = room_name;

			for(var i=0; i<rooms_connections[conn_index].connect.length; i++)
			  rooms_connections[conn_index].connect[i].send("[\"not_host\"," + JSON.stringify(game_rooms[rm_arr_index]) + "]");
			
			//update the room list in lobby 
			for (var i=0; i<clients.length; i++) {
				clients[i].send("[\"room_list\"," + JSON.stringify(game_rooms) + "]"); 
			}
		}
		else if (data[0] == "change_time") { // when host change the time
			var roomID = data[1][0];
			var time_val = data[1][1];
			var time_txt = data[1][2];

			var rm_arr_index = getIndexByRoomID(roomID);
			var conn_index = getConnectIndexByRmid(rooms_connections, roomID)

			for(var i=1; i<rooms_connections[conn_index].connect.length; i++)
			  rooms_connections[conn_index].connect[i].send("[\"change_time\",[\"" + roomID + "\",\"" + time_txt + "\"]]");
		}
		else if (data[0] == "chat_in_room") { // chat in game room
			var rmid = data[1][0];
			var c_uid = data[1][1];
			var content = data[1][2];
			
			var conn_index = getConnectIndexByRmid(rooms_connections, rmid);
			// acknowledge all room members including host
			for(var i=0; i<rooms_connections[conn_index].connect.length; i++)
			  rooms_connections[conn_index].connect[i].send("[\"chat_in_room\",[\"" + c_uid + "\",\"" + content + "\"]]");
		}
		else if (data[0] == "GO") { // go to start game
			var r_id = data[1].id;
			var arr_index = getIndexByRoomID(r_id);
			
			game_rooms[arr_index].status = "Playing";
			//update the room list in lobby 
			for (var i=0; i<clients.length; i++) {
				clients[i].send("[\"room_list\"," + JSON.stringify(game_rooms) + "]"); 
			}
			
			var conn_index = getConnectIndexByRmid(rooms_connections, r_id);
			
			var gameData = {};
			gameData.gameID = r_id;
			gameData.mapID = 'map1';
			gameData.totalPlayerNum  = game_rooms[arr_index].members.length + 1;
			gameData.players = [];
			for (var index in game_rooms[arr_index].members) {
				var player = game_rooms[arr_index].members[index];
				gameData.players.push({'id' : player.uid, 'pos' : parseInt(index)});
			}
			gameData.players.push({'id' : game_rooms[arr_index].host, 'pos' : 1+parseInt(index)});
			
			for(var i=0; i<rooms_connections[conn_index].connect.length; i++)
			  rooms_connections[conn_index].connect[i].send(JSON.stringify(['GO', gameData]));
		}

		//printStatus();
    });
	
	// When client disconnected
    connection.on('close', function(reasonCode, description) {
		if (url.parse(request.resource).pathname == "/room") {
			var roomID = querystring.parse(url.parse(request.resource).query)["id"];
			var isHost = checkUidIsRoomHost(uid);
			var conn_index = getConnectIndexByRmid(rooms_connections, roomID);
			
			arrayRemoveItem(in_rooms, connection);
			console.log("");
			console.log("check uid :" + uid);
			console.log(isHost);
			
			if (!isHost) {
				var rm_arr_index = getIndexByRoomID(roomID);
				if (typeof game_rooms[rm_arr_index] !== "undefined") // check if the room is removed
				{
				  var mem_arr_index = getMemberIndexByuid(game_rooms[rm_arr_index].members, uid);
				  if (typeof mem_arr_index !== "undefined") { // check if player is removed from room
					  removeMember(game_rooms[rm_arr_index].members, mem_arr_index); // remove room member
					  removeConnectInRoomConnect(rooms_connections, roomID, connection); // remove a connection in room_connect obj
					  
					  // acknowledge all room members including host
					  for(var i=0; i<rooms_connections[conn_index].connect.length; i++)
						rooms_connections[conn_index].connect[i].send("[\"not_host\"," + JSON.stringify(game_rooms[rm_arr_index]) + "]");
						
					  if (game_rooms[rm_arr_index].members.length == 0)
					    game_rooms[rm_arr_index].status = "Waiting";
					  else if (game_rooms[rm_arr_index].status == "Full")
					    game_rooms[rm_arr_index].status = "Waiting";
					  //else if (game_rooms[rm_arr_index].status == "Playing")
					   // game_rooms[rm_arr_index].status = "Playing";
					  
					  //update the room list in lobby 
					  for (var i=0; i<clients.length; i++) {
					    clients[i].send("[\"room_list\"," + JSON.stringify(game_rooms) + "]"); 
					  }
				  }
				  
				  /************** prepare start game ****************/
				  // get index of host in members
					var host_index = getMemberIndexByuid(game_rooms[rm_arr_index].members, game_rooms[rm_arr_index].host);
					var start_game = true;
					// ensure all members are ready
					if (game_rooms[rm_arr_index].members.length == 0)
					  start_game = false;
					else {
						for (var i=0; i<game_rooms[rm_arr_index].members.length; i++) {
							if (game_rooms[rm_arr_index].members[i].ready == "Not Ready")
							{
							  start_game = false;
							  break;
							}
						}
					}
					if (start_game)  // send message host of game room
					  rooms_connections[conn_index].connect[0].send("[\"start_game\"]");
					else
					  rooms_connections[conn_index].connect[0].send("[\"not_start_game\"]");
				}
				
				/********************** unlock cover ******************/
				var uid_index = getArrayIndex(uid_array, uid);
				if (typeof clients[uid_index] !== "undefined") {
				  clients[uid_index].send("[\"room_list\"," + JSON.stringify(game_rooms) + ",\"unlock\"]");
				}
			}
			else {
				// acknowledge all members of the same game room
				for (var i=0; i<rooms_connections[conn_index].connect.length; i++) {
					rooms_connections[conn_index].connect[i].send("[\"withdraw\"]");
				}
				
				objArrayRemoveItem(game_rooms, uid); 
				removeRoomConnect(rooms_connections, roomID);
				
				for (var i=0; i<clients.length; i++) {
				  clients[i].send("[\"room_list\"," + JSON.stringify(game_rooms) + "]");  //update the room list
				}
				
				var uid_index = getArrayIndex(uid_array, uid);
				clients[uid_index].send("[\"room_list\"," + JSON.stringify(game_rooms) + ",\"unlock\"]");
			}
		}
		else {
			var isHost = checkUidIsRoomHost(uid);
			if (isHost) {
				var roomID = checkWhichRoomOfHost(uid);
				var conn_index = getConnectIndexByRmid(rooms_connections, roomID);
				
				// acknowledge all members of the same game room
				for (var i=0; i<rooms_connections[conn_index].connect.length; i++) {
					rooms_connections[conn_index].connect[i].send("[\"withdraw\"]");
				}
				
				arrayRemoveItem(in_rooms, rooms_connections[conn_index].connect[0]);
				objArrayRemoveItem(game_rooms, uid); 
				removeRoomConnect(rooms_connections, roomID);
			}
			else {
				// check if he is member of game room
				var result = findPlayerInRoom(game_rooms, uid)
				if (result !== null) 
				{
				  console.log("disconnect: he is a member");
				  var mem_index = result.mem_index;
				  var room = result.room;

				  var rm_arr_index = getIndexByRoomID(room.id);
				  var conn_index = getConnectIndexByRmid(rooms_connections, room.id);
				  
				  // to that particular member
				  rooms_connections[conn_index].connect[mem_index+1].send("[\"withdraw\"]"); 
				  removeMember(game_rooms[rm_arr_index].members, mem_index); // remove room member
				  arrayRemoveItem(in_rooms, rooms_connections[conn_index].connect[mem_index+1]);
				  removeConnectInRoomConnect(rooms_connections, room.id, rooms_connections[conn_index].connect[mem_index+1]); // remove a connection in room_connect obj
				  
				  // acknowledge all room members including host
				  for(var i=0; i<rooms_connections[conn_index].connect.length; i++)
				  rooms_connections[conn_index].connect[i].send("[\"not_host\"," + JSON.stringify(game_rooms[rm_arr_index]) + "]");
						
				  if (game_rooms[rm_arr_index].members.length == 0)
					game_rooms[rm_arr_index].status = "Waiting";
				  else if (game_rooms[rm_arr_index].status == "Full")
					game_rooms[rm_arr_index].status = "Waiting";
					//else if (game_rooms[rm_arr_index].status == "Playing")
					// game_rooms[rm_arr_index].status = "Playing";
					  
				  //update the room list in lobby 
				  for (var i=0; i<clients.length; i++) {
					clients[i].send("[\"room_list\"," + JSON.stringify(game_rooms) + "]"); 
				  }
				}
				else
				  console.log("disconnect: he is not a member");
			}
		
			arrayRemoveItem(clients, connection);
			arrayRemoveItem(uid_array, uid);
			
			for (var i=0; i<clients.length; i++) {
			  clients[i].send("[\"uid\"," + JSON.stringify(uid_array) + "]");  //update who is online
			}
			
			for (var i=0; i<clients.length; i++) {
		      clients[i].send("[\"room_list\"," + JSON.stringify(game_rooms) + "]");  //update the room list
		    }
		}
		
        printStatus();
    });

});