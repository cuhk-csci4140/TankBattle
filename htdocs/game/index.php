<?php
    $gameData = urldecode($_GET["gamedata"]);
	include_once("../settings.php");
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Tank Online</title>
    <link rel="stylesheet" type="text/css" href="style.css">

    <script src="threex.keyboardstate.js"></script>
    <script src="Game.js"></script>
    <script src="Map.js"></script>
    <script src="Empty.js"></script>
    <script src="Tank.js"></script>
    <script src="Obstacle.js"></script>
    <script src="Box.js"></script>
    <script src="Food.js"></script>
    <script src="Fireball.js"></script>
    <script src="Explosion.js"></script>
    <script src="HitInfo.js"></script>
    <script src="BufferLoader.js"></script>
    <script>
        gameData = <?php echo $gameData; ?>;
        gameServerAddr = "ws://" + "<?php echo $server_addr; ?>" + ":8889";
        gameID = gameData.gameID;
        mapID = gameData.mapID;
        totalPlayerNum = gameData.totalPlayerNum;
        localPlayer = gameData.localPlayer;
        players = gameData.players;
    </script>

    <audio id="waiting_bg" src="./sounds/waiting_bg.mp3"  type="audio/mpeg" preload="auto" loop autoplay></audio>
    <audio id="fighting_bg" src="./sounds/fighting_bg.mp3"  type="audio/mpeg" preload="auto" loop=></audio>
</head>
<body>
    <div id="main">

        <div id="left_container">

            <div id="div_player1">
                <img id="tank_player1" src="./images/tank1_north.png" width="70" height="70"/>
                <span id="name_player1" style="font-size: 200%" >Player 1</span>
                <div id="hp_bar_container_player1"  style="border: solid white 1px; width:200px; height:30px;">
                    <div id="hp_bar_player1" style="width:200px; height:30px; background-color: green"></div>
                </div>
                <span style="float: right; font-size: 130%" ><span id="hp_value_player1">30</span>/<span id="max_hp_value_player1">30</span></span>
            </div>

            <div id="div_player2">
                <img id="tank_player2" src="./images/tank1_north.png" width="70" height="70"/>
                <span id="name_player2" style="font-size: 200%" >Player 2</span>
                <div id="hp_bar_container_player2"  style="border: solid white 1px; width:200px; height:30px;">
                    <div id="hp_bar_player2" style="width:200px; height:30px; background-color: green"></div>
                </div>
                <span style="float: right; font-size: 130%" ><span id="hp_value_player2">30</span>/<span id="max_hp_value_player2">30</span></span>
            </div>

            <div id="div_player3">
                <img id="tank_player3" src="./images/tank1_north.png" width="70" height="70"/>
                <span id="name_player3" style="font-size: 200%" >Player 3</span>
                <div id="hp_bar_container_player3"  style="border: solid white 1px; width:200px; height:30px;">
                    <div id="hp_bar_player3" style="width:200px; height:30px; background-color: green"></div>
                </div>
                <span style="float: right; font-size: 130%" ><span id="hp_value_player3">30</span>/<span id="max_hp_value_player3">30</span></span>
            </div>
        </div>

        <div id="canvas_container">
            <div id="canvas_bg">
                <canvas id="canvas"></canvas>
            </div>
        </div>

        <div id="right_container">

            <img id="tank_local" src="./images/tank1_north.png" style="margin-left: 100px" />
            <br />
            <span id="name_local" style="margin-left: 100px; font-size: 190%">Local Player</span>

            <br />
            <br />
            <br />
            <br />

            <div id="local_hp_bar_container">
                <div id="local_hp_bar"></div>
            </div>
            <span style="font-size: 150%"><span id="local_hp_value">30</span> / <span id="local_max_hp_value">30</span></span>

            <br />
            <br />

            <span style="font-size: 300%;">Fires: <span id="available_fire_count">2</span> / <span id="max_fire_count">2</span></span>

            <br />
            <br />
            <br />
            <br />

            <div id="special_status_container">
                Remaining Time: <span id="status_remaining_time"></span>
            </div>


            <div id="power_bar_container" style="background-color: white">
                <div id="power_bar" ></div>
            </div>

            <div id="power_level" style="background-color: red">1</div>
            <span id="power_level_label">Power Lever</span>
        </div>

    </div>

</body>
</html>