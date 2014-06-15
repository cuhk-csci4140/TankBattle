<?php session_start(); ?>
<?php
	include_once("settings.php");

	if(!isset($_SESSION['user']) && empty($_SESSION['user']))
	{
		echo '<html>';
		echo '<head><title>Super Battle Tank</title>';
		echo '<meta http-equiv="refresh" content="1;url=login.html" /></head>';
		echo '<body>please login first!</body>';
		echo '</html>';
	}
	else
	{
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Super Battle Tank</title>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>

<link rel="stylesheet" type="text/css" href="mystyle.css" />
<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.2/themes/smoothness/jquery-ui.css" />

</head>
<body>

	 <div id="cover" class="fadeMe"></div>
<script>

var player_id;
var i_am_host = false;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getCookie(cname)
{
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) 
	{
	  var c = ca[i].trim();
	  if (c.indexOf(name)==0) return c.substring(name.length,c.length);
	}
	return "";
}

function processLayout(received_msg)
{
	var data = JSON.parse(received_msg);
	if (data[0] == "room_not_exist") { // invalid room 
		$("#cover").css("opacity","1");
		$("#cover").css("display","inline");
		alert("invalid game room");
	}
	else if (data[0] == "already_in_room") { // already in room
		$("#cover").css("opacity","1");
		$("#cover").css("display","inline");
		alert("You are already in a game room");
	}
	else if (data[0] == "is_host") { // player is host
		//alert("you are host!");
		i_am_host = true;
		$("#host_row").append("Host : " + player_id);
		$("#start").css("display","inline");
		
		$("#roomName").empty();
		$("#roomName").append("game room");
		$("#roomEdit").css("display","inline");
		
		$("#time_span").text("Select Time: ");
		$("#select_time").css("display","inline");
	}
	else if (data[0] == "not_host") { // player is not host (also used for refresh member list)
		//alert("you are not host!");
		$("#host_row").empty();
		$("#host_row").append("Host: " + data[1].host);
		$("#roomName").empty();
		$("#roomName").append(decodeURI(data[1].name).replace(/</g,"_"));
		
		game_room = data[1];
		$("#members_row").empty();
		for(var i=0; i<data[1].members.length; i++) {
			$("#members_row").append("Player " + (i+2) + " : " + data[1].members[i].uid + " ");
			var ready = data[1].members[i].ready
			if (i_am_host) {
				if (ready == "Ready")
				  $("#members_row").append("<span id=span_ready>Ready</span>");
				else
				  $("#members_row").append("<span id=span_ready>Not Ready</span> ");
				$("#members_row").append('<input type="button" class=frm_btn2 id="' + data[1].members[i].uid + '" value="Kick">');
				$("#members_row").off("click","#" + data[1].members[i].uid).on("click", "#" + data[1].members[i].uid, function() {
					//alert(this.id);
					connection.send("[\"kick\",[\"" + rmid + "\",\"" + this.id + "\"]]");
				});
				
				/************** change time *******************/
				var time_txt = $("#select_time option:selected").text();
				var time_value = $("#select_time").val();
				connection.send("[\"change_time\",[\"" + rmid + "\",\"" + time_value + "\",\"" + time_txt + "\"]]");
			}
			else {
				if (data[1].members[i].uid == player_id) // gen button for myself
				{
					if (ready == "Ready")
					  $("#members_row").append('<input type="button" style="margin-left:10px;" class=frm_btn2 id="' + player_id + '" value="Ready">');
					else
					  $("#members_row").append('<input type="button" style="margin-left:10px;" class=frm_btn2 id="' + player_id + '" value="Not Ready">');
					// change ready status
					$("#members_row").off("click","#" + player_id).on("click", "#" + player_id, function() {
						$(this).attr("value") == "Not Ready" ? $(this).val("Ready") : $(this).val("Not Ready");
						connection.send("[\"ready_status\",[\"" + rmid + "\",\"" + player_id + "\",\"" + $(this).attr("value") + "\"]]");
					});
					
				}
				else {
					if (ready == "Ready")
					  $("#members_row").append("<span id=span_ready>Ready</span> ");
					else
					  $("#members_row").append("<span id=span_ready>Not Ready</span> ");
				}
			}
			$("#members_row").append("<br>");
		}
		/*if (!i_am_host){
			$("#time_selected").text($("#select_time option:selected").text());
		}*/
	}
	else if (data[0] == "withdraw") { // when host is left
		alert("This room is closed");
		$("#cover").css("display","inline");
	}
	else if (data[0] == "kicked") { // when member is kicked
		alert("You have been kicked out!");
		$("#cover").css("display","inline");
	}
	else if (data[0] == "duplicate") { // when duplicate connection exists
		alert("Duplicate Connection");
		$("#cover").css("display","inline");
	}
	else if (data[0] == "start_game") { // can start game
		//alert("You can start game!");
		//$("#start").css("display","inline");
		$("#start").prop('disabled', false);
	}
	else if (data[0] == "not_start_game") { // cannot start game
		//$("#start").css("display","none");
		$("#start").prop('disabled', true);
	}
	else if (data[0] == "chat_in_room") { // receive chat message from server
		var content = decodeURI(data[1][1]);
		$("#chat-area").append(data[1][0] + " : " + content.replace(/</g,"_") + "<br>");
		var objDiv = document.getElementById("chat-area");
		objDiv.scrollTop = objDiv.scrollHeight;
	}
	else if (data[0] == "change_time") { 
		var time_txt = data[1][1];
		$("#time_selected").text(time_txt);
	}
	else if (data[0] == "GO") { // receive Go message from server
		var gameData = data[1];
		gameData.gameServerAddr = "<?php echo $server_addr; ?>";
		gameData.localPlayer = player_id;
		for (var index in gameData.players) {
			if (player_id == gameData.players[index].id) {
				var local = gameData.players[index];
				gameData.players.splice(index , 1);
				gameData.players.unshift(local);
				break;
			}
		}
		window.location =  '/game/index.php?gamedata=' + encodeURI(JSON.stringify(gameData));
	}
}

var where = getCookie("where");
var rmid = getParameterByName("id");

if (where == "room") {
	alert("You are already in a game room");
	$("#cover").css("opacity","1");
	$("#cover").css("display","inline");
}
else {
var connection = new WebSocket("ws://" + "<?php echo $server_addr; ?>" + ":8888/room?id=" + rmid);
var game_room;
document.cookie="where=" + "room";

connection.onopen = function()
{
	// Web Socket is connected, send data using send()
	// when enter room, pass uid and roomid to server
	//player_id = getCookie("player_id");
	player_id = '<?php echo $_SESSION["user"]; ?>'; 
	connection.send("[\"enter_room\",[\"" + player_id + "\",\"" + rmid + "\"]]");
};

connection.onmessage = function (evt) 
{ 
    var received_msg = evt.data;
    //alert("Message is received..." + received_msg);
	processLayout(received_msg);
};
     
connection.onclose = function()
{ 
    // websocket is closed.
    alert("Connection is closed..."); 
};
}

document.ondblclick = function(evt) {
    if (window.getSelection)
        window.getSelection().removeAllRanges();
    else if (document.selection)
        document.selection.empty();
}

$(document).ready(function(){
  $("#start").click(function(e) {
	//alert("start game!");
	connection.send("[\"GO\"," + JSON.stringify(game_room) + "]");
	//alert(JSON.stringify(game_room));
  });
  
  $("#roomName").dblclick(function() {
	  //alert( "Handler for .dblclick() called." );
	  if (i_am_host){
	    $("#roomName").empty();
	    if ($("#roomName").children().length == 0)
	      $("#roomName").append('<input type="text" id="txt_rmname"  maxlength="20"></input>');
	  }
  });
  
  $("#btn_edit").click(function() {
	  //alert( "Handler for .dblclick() called." );
	  //alert($("textarea").val());
	  var content = encodeURI($("#txt_rmname").val());
	  if (content == "undefined")
	    content = "game room";
	  
	  $("#roomName").append(content);
	  connection.send("[\"change_name\",[\"" + rmid + "\",\"" + content + "\"]]");
	  $("#txt_rmname").remove();
  });
  
  $("#sendie").keypress(function(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
		var chat = encodeURI($("#sendie").val());
		connection.send("[\"chat_in_room\",[\"" + rmid + "\",\"" + player_id + "\",\"" + chat + "\"]]");
		$("#sendie").val('');
    }
  });
  
  $("#select_time").change(function() {
		//alert($("#select_time option:selected").text());
		var time_txt = $("#select_time option:selected").text();
		var time_value = $("#select_time").val();
		connection.send("[\"change_time\",[\"" + rmid + "\",\"" + time_value + "\",\"" + time_txt + "\"]]");
  });

});

</script>

	 <div id="roomLayout">
     <div id="topDiv" style="width:100%">
	 <img src="logo1.png" width="418" height="129" style="margin-left:160px;">
	 </div>
	
			 <div id="up_div" style="height:400px;">
			 <div id="roomInfo" style="border:1px solid black; height:55px; background-color: #B9CCBF;">
			 <div id="roomName" style="background-color: #EDF17C;"></div>
			 <div id="roomEdit" style="display:none;"><div style="margin-top: 2px;"><button type="button" id="btn_edit" class=form_btn1>Edit</button></div></div>
			 <div id="start_div">
			 <button type="button" id="start" disabled>Start</button></div>
			 </div>
			 <div id='host_row'>
			 </div>
			 <div id='members_row'>
			 </div>
			 </div>
			 <div id="bottom_div">
			 <div id="chat-wrap" >
			 
			 <div id="settingDiv">
			 <div id="time_div"style="margin-left: 20px; margin-top: 20px;">
			 <span id="time_span">Time: </span>
			 <select id=select_time style="display:none;">
			  <option value="3">3:00</option>
			  <option value="2">2:00</option>
			  <option value="1">1:00</option>
			 </select>
			 <span id=time_selected></span>
			 </div>
			 </div>
			 
			 <div id="chat-area"></div>
			 </div>
			 <div style="margin-left: 20px;">chat here: </div>
			 <textarea id="sendie" maxlength="100"></textarea>
			 </div>
	 </div>

</body>
<html>
<?php
	}
?>