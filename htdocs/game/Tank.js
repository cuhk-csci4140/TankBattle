function Tank(pos, playerID) {
    /**************** Constants Declaration ****************/
    // Type of tank
    this.TANK1 = 'tank1';
    this.TANK2 = 'tank2';
    this.TANK3 = 'tank3';
    this.TANK4 = 'tank4';

    // Directions
    this.NORTH = 'north';
    this.SOUTH = 'south';
    this.WEST = 'west';
    this.EAST = 'east';

    // Movement
    this.STANDING = 'stand';
    this.MOVING = 'move';

    /**************** Properties ****************/
    // player id
    this.id = playerID;

    // type of object
    this.objectType = TANK;

    // object image top-left corner position
    switch(pos) {
        case 0:
            this.x = 0;
            this.y = 0;
            this.faceDir = this.SOUTH;

            // type of tank
            this.tankType = this.TANK1;
            break;

        case 1:
            this.x = canvas.width - CELL_SIZE;
            this.y = canvas.height - CELL_SIZE;
            this.faceDir = this.NORTH;

            // type of tank
            this.tankType = this.TANK2;
            break;

        case 2:
            this.x = canvas.width - CELL_SIZE;
            this.y = 0;
            this.faceDir = this.SOUTH;

            // type of tank
            this.tankType = this.TANK3;
            break;

        case 3:
            this.x = 0;
            this.y = canvas.height - CELL_SIZE;
            this.faceDir = this.NORTH;

            // type of tank
            this.tankType = this.TANK4;
            break;
    }


    // object image width and height
    this.width = CELL_SIZE + 10;
    this.height = CELL_SIZE + 10;

    // moving speed in pixels per second
    this.speedLevel = 1;
    this.speed = 8;

    // movement: STANDING, MOVING
    this.movement = this.STANDING;

    // whether the object is collided
    this.collided = false;

    // whether the tank is focusing power
    this.focusingPower = false;

    // power
    this.defaultPowerLevel = 1;
    this.powerLevel = 1;
    this.power = 0;

    // hp
    this.maxHP = 30;
    this.HP = 30;

    // number of fires
    this.maxFireCount = 2;
    this.availableFireCount = 2;

    // indicating whether the tank is alive
    this.isAlive = true;

    // indicating whether the tank has special status
    this.specialStatus = -1;

    // special status start time
    this.statusStartTime = 0;

    // hitting information
    this.hitInfos  = new Array();
}

Tank.prototype.update = function() {
    // detect key press and update character status if any keys pressed
    this.checkKeyPress();

    // update tank movement and direction
    switch(this.movement) {
        case this.STANDING:
            break;
        case this.MOVING:
            switch (this.faceDir) {
                case this.NORTH:
                    this.moveUp();
                    break;
                case this.SOUTH:
                    this.moveDown();
                    break;
                case this.EAST:
                    this.moveRight();
                    break;
                case this.WEST:
                    this.moveLeft();
                    break;
            }
            break;
    }

    // updating tank firing power level
    if (this.focusingPower) {
        if (this.power < 200) {
            this.power += 2;
            this.powerLevel = 1 + Math.floor(this.power / 50);
        }
    } else {
        this.powerLevel = this.defaultPowerLevel;
        this.power = (this.defaultPowerLevel-1) * 50;
    }

    // update special status remaining time
    if (this.specialStatus != -1) {
        if ((Math.floor(new Date().getTime()/1000) - this.statusStartTime) > SPECIAL_STATUS_TIME) {
            this.specialStatus = -1;
            this.statusStartTime = 0;
        }
    }
}

Tank.prototype.draw = function() {
    var imgName;

    if (this.specialStatus == 2) {
        // invisible mode

        if (this == localTank) {
            // draw invisible tank for the local player
            imgName = 'invisible_tank_' + this.faceDir;
            context.drawImage(images[imgName], this.x, this.y, this.width, this.height);
        }

        return;
    }

    // get the correct image name to be drawn
    imgName = this.tankType + '_' + this.faceDir;

    // draw the tank
    context.drawImage(images[imgName], this.x, this.y, this.width, this.height);

    // draw pushing fire if the tank is moving
    if (this.movement == this.MOVING) {
        switch(this.faceDir) {
            case this.NORTH:
                context.drawImage(images['rocket_fire_north'], this.x, this.y+this.height, this.width, this.height/2);
                break;

            case this.SOUTH:
                context.drawImage(images['rocket_fire_south'], this.x, this.y-(this.height/2), this.width, this.height/2);
                break;

            case this.EAST:
                context.drawImage(images['rocket_fire_east'], this.x-(this.width/2), this.y, this.width/2, this.height);
                break;

            case this.WEST:
                context.drawImage(images['rocket_fire_west'], this.x+this.width, this.y, this.width/2, this.height);
                break;
        }
    }

    // draw special status effect
    switch (this.specialStatus) {
        case 0: // absorbing
            context.drawImage(images['food_absorbing'], this.x, this.y, this.width, this.height);
            break;

        case 1: // invincible
            context.drawImage(images['food_invincible'], this.x, this.y, this.width, this.height);
            break;

        case 3: // reflection
            break;
    }

}

Tank.prototype.checkKeyPress = function() {
    var up = keyboard.pressed('up');
    var down = keyboard.pressed('down');
    var left = keyboard.pressed('left');
    var right = keyboard.pressed('right');
    var space = keyboard.pressed('space');

    // No direction keyboard input
    if (!up && !down && !left && !right) { this.movement = this.STANDING; }

    // One-direction keyboard input
    if (up && !down && !left && !right) { this.movement = this.MOVING; this.faceDir = this.NORTH; }
    if (!up && down && !left && !right) { this.movement = this.MOVING; this.faceDir = this.SOUTH; }
    if (!up && !down && left && !right) { this.movement = this.MOVING; this.faceDir = this.WEST; }
    if (!up && !down && !left && right) { this.movement = this.MOVING; this.faceDir = this.EAST; }

    // check weather the tank is focusing power
    if (space) {
        this.focusingPower = true;
    } else {
        this.focusingPower = false;
    }
}

Tank.prototype.moveRight = function() {
    // move the tank pixel by pixel as a single move may involve multiple pixel according to diff. speed
    for (var i = 0; i < this.speed; i++) {

        // check if collide with right wall
        if (this.x+this.width-8 + 1 > canvas.width) {
            return;
        }

        // check if collide with obstacles
        var topCellIndex = map.getCellIndex(this.topRightX(), this.topRightY());
        var bottomCellIndex = map.getCellIndex(this.bottomRightX(), this.bottomRightY());
        if (map.cells[topCellIndex].collided && map.cells[bottomCellIndex].collided) {
            return;
        } else if (map.cells[topCellIndex].collided && !map.cells[bottomCellIndex].collided ) {
            // auto adjustment: move down
            this.y += 5;
            return;
        } else if (!map.cells[topCellIndex].collided && map.cells[bottomCellIndex].collided) {
            // auto adjustment: move up
            this.y -= 5;
            return;
        }

        this.x++;
    }
}

Tank.prototype.moveLeft = function() {
    // move the tank pixel by pixel as a single move may involve multiple pixel according to diff. speed
    for (var i = 0; i < this.speed; i++) {

        // check if collide with the left wall
        if (this.x+8 - 1 < 0) {
            return;
        }

        // check if collide with obstacles
        var topCellIndex = map.getCellIndex(this.topLeftX(), this.topLeftY());
        var bottomCellIndex = map.getCellIndex(this.bottomLeftX(), this.bottomLeftY());
        if (map.cells[topCellIndex].collided && map.cells[bottomCellIndex].collided) {
            return;
        } else if (map.cells[topCellIndex].collided && !map.cells[bottomCellIndex].collided ) {
            // auto adjustment: move down
            this.y += 5;
            return;
        } else if (!map.cells[topCellIndex].collided && map.cells[bottomCellIndex].collided) {
            // auto adjustment: move up
            this.y -= 5;
            return;
        }

        this.x--;
    }
}

Tank.prototype.moveUp = function() {
    // move the tank pixel by pixel as a single move may involve multiple pixel according to diff. speed
    for (var i = 0; i < this.speed; i++) {

        // check if collide with the upper wall
        if (this.y+8 - 1 < 0) {
            return;
        }

        // check if collide with obstacles
        var leftCellIndex = map.getCellIndex(this.topLeftX(), this.topLeftY());
        var rightCellIndex = map.getCellIndex(this.topRightX(), this.topRightY());
        if (map.cells[leftCellIndex].collided && map.cells[rightCellIndex].collided) {
            return;
        } else if (map.cells[leftCellIndex].collided && !map.cells[rightCellIndex].collided ) {
            // auto adjustment: move right
            this.x += 5;
            return;
        } else if (!map.cells[leftCellIndex].collided && map.cells[rightCellIndex].collided) {
            // auto adjustment: move left
            this.x -= 5;
            return;
        }

        this.y--;
    }
}

Tank.prototype.moveDown = function() {
    // move the tank pixel by pixel as a single move may involve multiple pixel according to diff. speed
    for (var i = 0; i < this.speed; i++) {

        // check if collide with the lower wall
        if (this.y+this.height-8 + 1 > canvas.height) {
            return;
        }

        // check if collide with obstacles
        var leftCellIndex = map.getCellIndex(this.bottomLeftX(), this.bottomLeftY());
        var rightCellIndex = map.getCellIndex(this.bottomRightX(), this.bottomRightY());
        if (map.cells[leftCellIndex].collided && map.cells[rightCellIndex].collided) {
            return;
        } else if (map.cells[leftCellIndex].collided && !map.cells[rightCellIndex].collided ) {
            // auto adjustment: move right
            this.x += 5;
            return;
        } else if (!map.cells[leftCellIndex].collided && map.cells[rightCellIndex].collided) {
            // auto adjustment: move left
            this.x -= 5;
            return;
        }

        this.y++;

    }

}

Tank.prototype.topLeftX = function() {
    return this.x+15;
}

Tank.prototype.topLeftY = function() {
    return this.y+15;
}

Tank.prototype.topRightX = function() {
    return this.x+this.width-15;
}

Tank.prototype.topRightY = function() {
    return this.y+15;
}

Tank.prototype.bottomLeftX = function() {
    return this.x+15;
}

Tank.prototype.bottomLeftY = function() {
    return this.y+this.height-15;
}

Tank.prototype.bottomRightX = function() {
    return this.x+this.width-15;
}

Tank.prototype.bottomRightY = function() {
    return this.y+this.height-15;
}

Tank.prototype.firing = function(e) {
    e.stopPropagation();
    e.preventDefault();

    if (e.keyCode == 32 && localTank.isAlive && localTank.availableFireCount > 0) {
        var owner = localTank.id;
        var powerLevel = localTank.powerLevel;
        var direction = localTank.faceDir;
        var x = localTank.x;
        var y = localTank.y;

        newFire = new Fireball(owner, powerLevel, direction, x, y);
        map.fireballs.push(newFire);
        localTank.availableFireCount--;
    }
}

Tank.prototype.hit = function(x, y) {
    var margin = 5;
    if (x > (this.x+margin) && x < (this.x+this.width-margin) && y > (this.y+margin) && y < (this.y+this.height-margin)) {
        return true;
    } else {
        return false;
    }
}