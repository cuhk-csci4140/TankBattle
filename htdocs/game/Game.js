function init() {
    // check whether the user web browser support websocket
    if (!isSupportedWS()) {
        return;
    }

    mapWidthCellNum = 15;
    mapHeightCellNum = 15;
    mapStr =    '  qqqqqqqqqqq  ' +
                'wwwwwwwwwwwwwww' +
                'eeeeeeeeeeeeeee' +
                'rrrrrrrrrrrrrrr' +
                'ttttttttttttttt' +
                'yyyyyyyyyyyyyyy' +
                'uuuuuuuuuuuuuuu' +
                '  ZZ XX CC VV  ' +
                'uuuuuuuuuuuuuuu' +
                'yyyyyyyyyyyyyyy' +
                'ttttttttttttttt' +
                'rrrrrrrrrrrrrrr' +
                'eeeeeeeeeeeeeee' +
                'wwwwwwwwwwwwwww' +
                '  qqqqqqqqqqq  ' ;

    /****************Constants Declarations****************/
    // Number of frames per second
    FPS = 30;

    // dimension of a cell in pixel
    CELL_SIZE = 60;

    // Types of Objects
    EMPTY = 0;
    TANK = 1;
    OBSTACLE = 2;
    BOX = 3;
    FOOD = 4;
    EXPLOSION = 5;
    HIT_INFO = 6;

    //  the probability that the box will generate a food ( 0: no food generated, 1: always generated )
    FOOD_GENERATE_PROB = 0.7;

    // lasting time of special status in second
    SPECIAL_STATUS_TIME = 15;

    // message types
    PLAYER_READY = 0;
    START_GAME = 1;
    UPDATE_TANK_INFO = 2;
    END_GAME = 3;
    TANK_DESTROYED = 4;
    TANK_STATUS = 10;
    NEW_FIRE = 11;
    BOX_DESTROYED = 12;
    NEW_FOOD = 13;

    // Initialize images and sounds
    // images sources
    imgSources = {
        // Tank
        'tank1_north' : './images/tank1_north.png',
        'tank1_east' : './images/tank1_east.png',
        'tank1_south' : './images/tank1_south.png',
        'tank1_west' : './images/tank1_west.png',
        'tank2_north' : './images/tank2_north.png',
        'tank2_east' : './images/tank2_east.png',
        'tank2_south' : './images/tank2_south.png',
        'tank2_west' : './images/tank2_west.png',
        'tank3_north' : './images/tank3_north.png',
        'tank3_east' : './images/tank3_east.png',
        'tank3_south' : './images/tank3_south.png',
        'tank3_west' : './images/tank3_west.png',
        'tank4_north' : './images/tank4_north.png',
        'tank4_east' : './images/tank4_east.png',
        'tank4_south' : './images/tank4_south.png',
        'tank4_west' : './images/tank4_west.png',
        'invisible_tank_north' : './images/invisible_tank_north.png',
        'invisible_tank_east' : './images/invisible_tank_east.png',
        'invisible_tank_south' : './images/invisible_tank_south.png',
        'invisible_tank_west' : './images/invisible_tank_west.png',
        'rocket_fire_north' : './images/rocket_fire_north.png',
        'rocket_fire_south' : './images/rocket_fire_south.png',
        'rocket_fire_east' : './images/rocket_fire_east.png',
        'rocket_fire_west' : './images/rocket_fire_west.png',

        // Obstacle
        'brown_stone' : './images/brown_stone.png',
        'ice' : './images/ice.png',
        'tree1' : './images/tree1.png',
        'tree2' : './images/tree2.png',

        // Fireball
        'min_fire_north' : './images/min_fire_north.png',
        'min_fire_east' : './images/min_fire_east.png',
        'min_fire_south' : './images/min_fire_south.png',
        'min_fire_west' : './images/min_fire_west.png',
        'middle_fire_north' : './images/middle_fire_north.png',
        'middle_fire_east' : './images/middle_fire_east.png',
        'middle_fire_south' : './images/middle_fire_south.png',
        'middle_fire_west' : './images/middle_fire_west.png',
        'max_fire_north' : './images/max_fire_north.png',
        'max_fire_east' : './images/max_fire_east.png',
        'max_fire_south' : './images/max_fire_south.png',
        'max_fire_west' : './images/max_fire_west.png',

        // Explosion
        'explosion_0' : './images/explosion_0.png',
        'explosion_1' : './images/explosion_1.png',
        'explosion_2' : './images/explosion_2.png',
        'explosion_3' : './images/explosion_3.png',
        'explosion_4' : './images/explosion_4.png',
        'explosion_5' : './images/explosion_5.png',
        'explosion_6' : './images/explosion_6.png',
        'explosion_7' : './images/explosion_7.png',
        'explosion_8' : './images/explosion_8.png',
        'explosion_9' : './images/explosion_9.png',
        'explosion_10' : './images/explosion_10.png',
        'explosion_11' : './images/explosion_11.png',
        'explosion_12' : './images/explosion_12.png',
        'explosion_13' : './images/explosion_13.png',
        'explosion_14' : './images/explosion_14.png',
        'explosion_15' : './images/explosion_15.png',
        'explosion_16' : './images/explosion_16.png',
        'explosion_17' : './images/explosion_17.png',
        'explosion_18' : './images/explosion_18.png',
        'explosion_19' : './images/explosion_19.png',
        'explosion_20' : './images/explosion_20.png',
        'explosion_21' : './images/explosion_21.png',
        'explosion_22' : './images/explosion_22.png',

        // Boxes
        'box_q' : './images/box_q.png',
        'box_w' : './images/box_w.png',
        'box_e' : './images/box_e.png',
        'box_r' : './images/box_r.png',
        'box_t' : './images/box_t.png',
        'box_y' : './images/box_y.png',
        'box_u' : './images/box_u.png',

        // Food
        'food_power_up' : './images/food_power_up.png',
        'food_bullet' : './images/food_bullet.png',
        'food_hp' : './images/food_hp.png',
        'food_speed_up' : './images/food_speed_up.png',
        'food_absorbing' : './images/food_absorbing.png',
        'food_invisible' : './images/food_invisible.png',
        'food_invincible' : './images/food_invincible.png',

        // HitInfo
        'minus_one' : './images/minus_one.png',
        'minus_two' : './images/minus_two.png',
        'minus_three' : './images/minus_three.png',
        'minus_four' : './images/minus_four.png',
        'minus_five' : './images/minus_five.png',
        'add_one' : './images/add_one.png',
        'add_two' : './images/add_two.png',
        'add_three' : './images/add_three.png',
        'add_four' : './images/add_four.png',
        'add_five' : './images/add_five.png',
        'add_twenty' : './images/add_twenty.png',

        // others
        'waiting' : './images/waiting.png',
        'ready' : './images/ready.png',
        'go' : './images/go.png',
        'win' : './images/win.png',
        'lose' : './images/lose.png'

    };

    // create image objects and load image sources
    images = {};
    for (var src in imgSources) {
        images[src] = new Image();
        images[src].src = this.imgSources[src];
    }

    // Web Audio API: initializing sounds
    soundSources = {
        'ready_go' : './sounds/ready_go.mp3',
        'fire' : './sounds/fire.mp3',
        'explosion' : './sounds/explosion.mp3',
        'eat_food' : './sounds/eat_food.wav',
        'special_status' : './sounds/special_status.wav',
        'invincible_protected' : './sounds/invincible_protected.wav',
        'absorbing' : './sounds/absorbing.wav',
        'you_win' : './sounds/you_win.mp3',
        'you_lose' : './sounds/you_lose.mp3'
    };

    soundSourcesArray = [];
    for (var src in soundSources) {
        soundSourcesArray.push(soundSources[src]);
    }

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    bufferLoader = new BufferLoader(
        audioContext,
        soundSourcesArray,
        finishedLoading
    );

    bufferLoader.load();

    soundBuffers = {};
    soundLoaded = false;
    function finishedLoading(bufferList) {
        var i = 0;
        for (var src in soundSources) {
            soundBuffers[src] = bufferList[i];
            i++;
        }
        soundLoaded = true;
    }

    window.playSound = function(buffer) {
        var source = audioContext.createBufferSource(); // creates a sound source
        source.buffer = buffer;                         // tell the source which sound to play
        source.connect(audioContext.destination);       // connect the source to the context's destination (the speakers)
        source.start(0);                                // play the source now
                                                        // note: on older systems, may have to use deprecated noteOn(time);
    }

    // Get HTML element objects
    canvasContainer = document.getElementById('canvas_container');
    canvas = document.getElementById('canvas');
    context = canvas.getContext("2d");
    powerBar = document.getElementById('power_bar');
    powerLevel = document.getElementById('power_level');
    localHpBar = document.getElementById('local_hp_bar');
    localHpValue = document.getElementById('local_hp_value');
    localMaxHpValue = document.getElementById('local_max_hp_value');
    maxFireCount = document.getElementById('max_fire_count');
    availableFireCount = document.getElementById('available_fire_count');
    specialStatusContainer = document.getElementById('special_status_container');
    statusRemainingTime = document.getElementById('status_remaining_time');
    localTankImg = document.getElementById('tank_local');
    localPlayerName = document.getElementById('name_local');
    waiting_bg = document.getElementById('waiting_bg');
    fighting_bg = document.getElementById('fighting_bg');

    // player1 info
    player1_info_container = document.getElementById('div_player1');
    player1_tank = document.getElementById('tank_player1');
    player1_name = document.getElementById('name_player1');
    player1_hp_bar = document.getElementById('hp_bar_player1');
    player1_hp_value = document.getElementById('hp_value_player1');
    player1_max_hp_value = document.getElementById('max_hp_value_player1');

    // player2 info
    player2_info_container = document.getElementById('div_player2');
    player2_tank = document.getElementById('tank_player2');
    player2_name = document.getElementById('name_player2');
    player2_hp_bar = document.getElementById('hp_bar_player2');
    player2_hp_value = document.getElementById('hp_value_player2');
    player2_max_hp_value = document.getElementById('max_hp_value_player2');

    // player3 info
    player3_info_container = document.getElementById('div_player3');
    player3_tank = document.getElementById('tank_player3');
    player3_name = document.getElementById('name_player3');
    player3_hp_bar = document.getElementById('hp_bar_player3');
    player3_hp_value = document.getElementById('hp_value_player3');
    player3_max_hp_value = document.getElementById('max_hp_value_player3');


    // HTML elements intialization
    localPlayerName.innerHTML = players[0].id;
    localTankImg.src = './images/tank' + parseInt(players[0].pos+1) + '_north.png';


    player1_info_container.style.display = 'inherit';
    player1_name.innerHTML = players[1].id;
    player1_tank.src = './images/tank' + parseInt(players[1].pos+1) + '_north.png';

    if (players.length > 2) {
        player2_info_container.style.display = 'inherit';
        player2_name.innerHTML = players[2].id;
        player2_tank.src = './images/tank' + parseInt(players[2].pos+1) + '_north.png';
    }

    if (players.length > 3) {
        player3_info_container.style.display = 'inherit';
        player3_name.innerHTML = players[3].id;
        player3_tank.src = './images/tank' + parseInt(players[3].pos+1) + '_north.png';
    }


    // Create keyboard object
    keyboard = new THREEx.KeyboardState();

    // Create tanks and map objects
    map = new Map(mapWidthCellNum, mapHeightCellNum, mapStr);

    // Get local tank object
    localTank = map.tanks[localPlayer];

    // indicating whether the game is ended
    gameEnded = false;

    // add firing listener for local user
    window.addEventListener('keyup', localTank.firing);

    // new Fireball object
    newFire = null;

    // new destroyed box
    destroyedBoxCellIndex = -1;

    // new food
    newFood = null;

    // connect to Tank Online Websocket Server
    connection = new WebSocket(gameServerAddr);

    connection.onopen = function () {
        sendReadyMsg();
    };

    connection.onerror = function (error) {
        alert('Connection Error');
    };

    connection.onmessage = function (message) {
        recieveData(message);
    };

    setTimeout(printWaitingMessage, 3000);
}

function sendReadyMsg() {
    if (!soundLoaded) {
        setTimeout(sendReadyMsg, 1000);
        return;
    }

    // send player ready message
    var msg = [
        PLAYER_READY,
        gameID,
        [
            mapID,
            totalPlayerNum
        ]
    ];
    connection.send(JSON.stringify(msg));
}

function printWaitingMessage() {

    // draw obstacles and boxes
    for (var index in map.cells) {
        if (map.cells[index].objectType != EMPTY){
            map.cells[index].draw();
        }
    }

    // draw tanks
    for (var tank in map.tanks) {
        map.tanks[tank].draw();
    }

    // drawing waiting message
    context.drawImage(images.waiting, Math.floor(canvas.width / 2 - 200), Math.floor(canvas.height / 2 - 75), 400, 150);
}

function printReadyMessage() {

    playSound(soundBuffers.ready_go);

    map.clearMap();

    // draw obstacles and boxes
    for (var index in map.cells) {
        if (map.cells[index].objectType != EMPTY){
            map.cells[index].draw();
        }
    }

    // draw tanks
    for (var tank in map.tanks) {
        map.tanks[tank].draw();
    }

    // drawing loading message
    context.drawImage(images.ready, Math.floor(canvas.width / 2 - 200), Math.floor(canvas.height / 2 - 75), 400, 150);
}

function printGoMessage() {

    map.clearMap();

    // draw obstacles and boxes
    for (var index in map.cells) {
        if (map.cells[index].objectType != EMPTY){
            map.cells[index].draw();
        }
    }

    // draw tanks
    for (var tank in map.tanks) {
        map.tanks[tank].draw();
    }

    // drawing loading message
    context.drawImage(images.go, Math.floor(canvas.width / 2 - 200), Math.floor(canvas.height / 2 - 75), 400, 150);

    waiting_bg.pause();
    fighting_bg.play();
    fighting_bg.addEventListener('ended', function(){
        this.currentTime = 0;
        this.load();
        this.play();
    }, false);
}

function recieveData(message) {
    var data = JSON.parse(message.data);
    var msgType = data[0];

    switch (msgType) {
        case START_GAME: // game start message
            printReadyMessage();
            setTimeout(printGoMessage, 2000);
            setTimeout(startGame,3000);
            break;

        case UPDATE_TANK_INFO: // update tank info message
            var msgs = data[2];
            for (var index in msgs) {
                var msg = msgs[index];
                switch(msg[0]) {
                    case TANK_STATUS:
                        var tank = map.tanks[msg[1]];
                        tank.movement = msg[2];
                        tank.faceDir = msg[3];
                        tank.x = msg[4];
                        tank.y = msg[5];
                        if (tank.isAlive != msg[6]) {
                            // the tank just destroyed, add explosion effect
                            tank.isAlive = msg[6];
                            map.explosions.push(new Explosion(3, tank.x, tank.y));
                        }
                        tank.maxHP = msg[7];
                        tank.HP = msg[8];
                        tank.specialStatus = msg[9];

                        switch (msg[1]) {
                            case players[1].id:
                                player1_max_hp_value.innerHTML = tank.maxHP;
                                player1_hp_value.innerHTML = tank.HP;
                                player1_hp_bar.style.width = Math.floor( tank.HP/tank.maxHP * 200 ) + 'px';
                                break;

                            case players[2].id:
                                player2_max_hp_value.innerHTML = tank.maxHP;
                                player2_hp_value.innerHTML = tank.HP;
                                player2_hp_bar.style.width = Math.floor( tank.HP/tank.maxHP * 200 ) + 'px';
                                break;

                            case players[3].id:
                                player3_max_hp_value.innerHTML = tank.maxHP;
                                player3_hp_value.innerHTML = tank.HP;
                                player3_hp_bar.style.width = Math.floor( tank.HP/tank.maxHP * 200 ) + 'px';
                                break;
                        }
                        break;

                    case NEW_FIRE:
                        map.fireballs.push(new Fireball(msg[1], msg[2], msg[3], msg[4], msg[5]));
                        break;

                    case BOX_DESTROYED:
                        var cellIndex = msg[1];
                        var cellObj = map.cells[cellIndex];
                        if (cellObj.objectType == BOX) {
                            map.explosions.push(new Explosion(3, cellObj.x, cellObj.y));
                            var empty = new Empty(cellObj.x, cellObj.y);
                            map.cells[cellIndex] = empty;
                        }
                        break;

                    case NEW_FOOD:
                        var food = new Food(msg[1], msg[2], msg[3]);
                        map.foods.push(food);
                        break;
                }
            }
            break;

        case END_GAME:
            setTimeout(endGame, 2000);
            break;
    }

}

function updateTankInfo() {
    var data = new Array();
    data.push(UPDATE_TANK_INFO);
    data.push(gameID);

    var msg = new Array();

    // update tank's position
    var tankStatus = [TANK_STATUS, localTank.id, localTank.movement, localTank.faceDir, localTank.x, localTank.y, localTank.isAlive, localTank.maxHP, localTank.HP, localTank.specialStatus];
    msg.push(tankStatus);

    // update if there is new fire
    if (newFire != null) {
        msg.push([NEW_FIRE, newFire.owner, newFire.powerLevel, newFire.direction, newFire.x, newFire.y]);
        newFire = null;
    }

    // update if there is new destroyed box
    if (destroyedBoxCellIndex >= 0) {
        msg.push([BOX_DESTROYED, destroyedBoxCellIndex]);
        destroyedBoxCellIndex = -1;
    }

    // update if there is new food generated
    if (newFood != null) {
        msg.push([NEW_FOOD, newFood.x, newFood.y, newFood.foodType]);
        newFood = null;
    }

    // send data to game server
    data.push(msg);
    connection.send(JSON.stringify(data));
}

function isSupportedWS() {
    if (!window.WebSocket) {
        alert( "HTML5 WebSocket is not supported in your browser. Please use other Web Browser.");
        return false;
    }
    return true;
}

function startGame() {
    setInterval(gameLoop, 1000/FPS);
}

function endGame() {
    gameEnded = true;

    if (localTank.isAlive) {
        context.drawImage(images.win, Math.floor(canvas.width / 2 - 200), Math.floor(canvas.height / 2 - 75), 400, 150);
        playSound(soundBuffers.you_win);
    } else {
        context.drawImage(images.lose, Math.floor(canvas.width / 2 - 200), Math.floor(canvas.height / 2 - 75), 400, 150);
        playSound(soundBuffers.you_lose);
    }

    //setTimeout(function(){ window.location = webServerAddr + '/gameroom?id=' + gameID; }, 5000);
    setTimeout(function(){ window.close(); }, 5000);
}

function gameLoop() {
    // stop looping when the game is ended
    if (gameEnded) {
        return;
    }

    // ========== Update phase ============
    // update local tank
    if (localTank.isAlive) {
        localTank.update();
    }
    // update the tanks hit information
    for (var tank in map.tanks) {
        var t = map.tanks[tank];
        for (var hit in t.hitInfos) {
            t.hitInfos[hit].x = t.x;
            t.hitInfos[hit].y = t.y;
            t.hitInfos[hit].update();
        }
    }
    // update fireballs
    for (var index in map.fireballs) {
        map.fireballs[index].update();
    }
    // update explosions
    for (var index in map.explosions) {
        map.explosions[index].update();
    }
    // update foods
    for (var index in map.foods) {
        map.foods[index].update();
    }

    updateTankInfo();

    // ========== Removing phase ===============
    // remove invalid fireballs
    for (var index in map.fireballs) {
        if (map.fireballs[index].invalid) {

            if (map.fireballs[index].owner == localTank.id && localTank.availableFireCount < localTank.maxFireCount) {
                localTank.availableFireCount++;
            }

            map.fireballs.splice(index, 1);
        }
    }
    // remove invalid explosions
    for (var index in map.explosions) {
        if (map.explosions[index].invalid) {
            map.explosions.splice(index, 1);
        }
    }
    // remove invalid hit information
    for (var tank in map.tanks) {
        var t = map.tanks[tank];
        for (var hit in t.hitInfos) {
            if (t.hitInfos[hit].invalid) {
                t.hitInfos.splice(hit, 1);
            }
        }
    }
    // remove invalid foods
    for(var index in map.foods) {
        if (map.foods[index].invalid) {
            map.foods.splice(index, 1);
        }
    }


    // ========== Clear Map ===============
    map.clearMap();


    // ========== Drawing phase ===========
    // draw obstacles and boxes
    for (var index in map.cells) {
        if (map.cells[index].objectType != EMPTY){
            map.cells[index].draw();
        }
    }
    // draw tanks
    for (var tank in map.tanks) {
        if (map.tanks[tank].isAlive) {
            map.tanks[tank].draw();
        }
    }
    // draw fireballs
    for (var index in map.fireballs) {
        map.fireballs[index].draw();
    }
    // draw explosions
    for (var index in map.explosions) {
        map.explosions[index].draw();
    }
    // draw hit information
    for (var tank in map.tanks) {
        var t = map.tanks[tank];
        for (var hit in t.hitInfos) {
            t.hitInfos[hit].draw();
        }
    }
    // draw foods
    for (var index in map.foods) {
        map.foods[index].draw();
    }
    // draw power bar and power level
    powerBar.style.height = localTank.power + 'px';
    if (localTank.powerLevel == 5) {
        powerLevel.innerHTML = "Max";
    } else {
        powerLevel.innerHTML = localTank.powerLevel;
    }
    // draw local hp bar value
    localHpBar.style.width = Math.floor( localTank.HP/localTank.maxHP * 250 ) + 'px';
    localHpValue.innerHTML = localTank.HP;
    localMaxHpValue.innerHTML = localTank.maxHP;
    // draw fire count
    maxFireCount.innerHTML = localTank.maxFireCount;
    availableFireCount.innerHTML = localTank.availableFireCount;
    // draw special status remaining time
    if (localTank.specialStatus != -1) {
        specialStatusContainer.style.display = 'block';
        statusRemainingTime.innerHTML = SPECIAL_STATUS_TIME - (Math.floor(new Date().getTime()/1000) - localTank.statusStartTime) + 's';
    } else {
        specialStatusContainer.style.display = 'none';
    }


}

window.addEventListener('load', init);