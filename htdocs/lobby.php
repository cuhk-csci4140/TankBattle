<?php session_start(); ?>

<?php
	include_once("settings.php");

	if(!isset($_SESSION['user']) && empty($_SESSION['user']))
	{
		echo '<html>';
		echo '<head><title>Super Battle Tank</title>';
		echo '<meta http-equiv="refresh" content="1;url=index.html" /></head>';
		echo '<body>please login first!</body>';
		echo '</html>';
	}
	else 
	{	
		$_SESSION['count'] ++;
		$enter_count = $_SESSION['count'];
		if ($enter_count > 1) 
			echo "you are already in here";
		else
		{
?>
<!DOCTYPE HTML>
<html>
<head>
<title>Super Battle Tank</title>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script>

var player_id;

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function processLayout(received_msg)
{
	var data = JSON.parse(received_msg);
	if (data[0] == "uid") { // who is online
		$("#onlineList").empty();
		for(var i=0; i<data[1].length; i++) {
		  var uid = data[1][i];
		  $("#onlineList").append("<div id='on_list'><span style='margin-left: 10px'>" + uid + "</span></div>");
		}
	}
	else if (data[0] == "chat") { // append chat content
		var content = decodeURI(data[1][1]);
		$("#chat-area").append(data[1][0] + " : " + content.replace(/</g,"_") + "<br>");
		var objDiv = document.getElementById("chat-area");
		objDiv.scrollTop = objDiv.scrollHeight;
	}
	else if (data[0] == "create_response") {
		//alert("room id is " + data[1]);
		/*$("#roomList").empty(); // update room list
		var tbl_content = "<table id=tbl_room>";
		for(var i=0; i<data[1][1].length; i++) {
			var roomID = data[1][1][i].id;
			var host = data[1][1][i].host;
			var name = decodeURI(data[1][i].name).replace(/</g,"_");
			var status = data[1][1][i].status;
			
			tbl_content += "<tr id=" + roomID + " class=rmList><td>" 
				+ roomID + "</td><td>" + name + "</td><td>" + host + "</td><td>" + status + "</td></tr>";
			$("#roomList").off("click","#" + roomID).on("click", "#" + roomID, function(e) {
				window.open(
				  '/gameroom.php?id=' + roomID,
				  '_blank' // <- This is what makes it open in a new window.
				);
			});
		}
		tbl_content += "</table>";
		$("#roomList").append(tbl_content);*/
		
		$("#cover").css("display","inline"); // avoid duplicate connection
		
		window.open(
		  '/gameroom.php?id=' + data[1][0],
		  '_blank' // <- This is what makes it open in a new window.
		);
	}
	else if (data[0] == "create_reject") {
		alert("You are already the host!");
	}
	else if (data[0] == "room_list") { // update room list
		if (typeof data[2] !== "undefined") {
		  $("#cover").css("display","none");
		  document.cookie="where=" + "lobby";
		}
		
		$("#roomList").empty();
		var tbl_content = "<table id=tbl_room>";
		for(var i=0; i<data[1].length; i++) {
			var roomID = data[1][i].id;
			var host = data[1][i].host;
			var name = decodeURI(data[1][i].name).replace(/</g,"_");
			var status = data[1][i].status;
			var mems = 1;
			typeof data[1][i].members !== "undefined" ? mems+= data[1][i].members.length : mems = 1;
			
			tbl_content += "<tr id=" + roomID + " class=rmList>" +
				"<td id=rmName>" + name + "</td><td id=host>" + host + "</td><td id=no_players>" + mems + "/4" + "</td><td id=status>" + status + "</td></tr>";
				
			if (status == "Waiting")
				$("#roomList").off("click","#" + roomID).on("click", "#" + roomID, function(e) {
					$("#cover").css("display","inline"); // avoid duplicate connection
					window.open(
					  '/gameroom.php?id=' + roomID,
					  '_blank' // <- This is what makes it open in a new window.
					);
				});
			else if (status == "Full")
				$("#roomList").off("click","#" + roomID).on("click", "#" + roomID, function(e) {
					alert("This room is full");
				});
			else if (status == "Playing")
				$("#roomList").off("click","#" + roomID).on("click", "#" + roomID, function(e) {
					alert("This room is in the game");
				});
			
		}
		tbl_content += "</table>";
		$("#roomList").append(tbl_content);
	}
}

document.cookie="where=" + "lobby";
var connection = new WebSocket("ws://" + "<?php echo $server_addr; ?>" + ":8888");
connection.onopen = function()
{
	// Web Socket is connected, send data using send()
	// send userid
	//player_id = makeid();
	player_id = '<?php echo $_SESSION["user"]; ?>';
	$("#myid").append("Hi! " + player_id);
	
	//document.cookie="player_id=" + player_id;
    connection.send("[\"uid\",[\"" + player_id + "\"]]");
	connection.send("[\"room_list\",[]]");
   // alert("Message is sent...");
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


$(document).ready(function(){
  // ban enter input // chat function
  $("#sendie").keypress(function(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
		var chat = encodeURI($("#sendie").val());
		connection.send("[\"chat\",[\"" + player_id + "\",\"" + chat + "\"]]");
		$("#sendie").val('');
    }
  });
  
  $("#create").click(function(e) {
		connection.send("[\"create_request\",[\"" + player_id + "\"]]");
  });
});

function redirectLogout() {
	window.location = "logout.php";
}

</script>
<link rel="stylesheet" type="text/css" href="mystyle.css">
</head>
<body>
<div id="layout">
	<div id="cover" class="fadeMe"></div>
	<div id="topDiv" style="width:100%">
	<div style="margin-left:30px; float:left;"><img src="logo1.png" width="418" height="129"></div>	
	<div id='person'>
	<div id='myid' style="margin-top: 10px; margin-bottom: 7px;"></div>
	<button id='logout' class='form_btn1' onclick='redirectLogout()'>logout</button>
	</div>

	</div>
	
	<div id='listTitle'>
	<table id="roomHead">
	<tr><th id='rmName'>room name</th><th id='host'>host</th><th id='no_players'>no. of players</th><th id='status'>status</th></tr>
	</table>
	</div>
	<div id='roomList'>
	</div>
	
	<div id="bt">
	
	<button type="button" id="create" class="frm_btn2" value="create" style="margin-left:490px;">Create Room</button>
	</div>

	<div id="bottomDiv">
	<div id="onlineListDiv">
	<table id="userHead" style="border-bottom:1px solid gray; width:100%;">
	<tr><th id='onlineUname'>online player</th></tr>
	</table>
	<div id="onlineList">
	</div>
	</div>
	<div id="chat-wrap"><div id="chat-area"></div></div>
	<form id="send-message-area">
        <div style="margin-left: 15px; background-color: #DBE4DE; width:80px;">chat here:</div>
        <textarea id="sendie" maxlength=100"></textarea>
    </form>
	</div>
</div>
</body>
</html>
<?php
		}
	}
?>