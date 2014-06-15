function Food(x, y, foodType) {
    this.objectType = FOOD;
    this.foodType = foodType;

    // object image top-left corner position
    this.x = x;
    this.y = y;

    // cell index of the food
    this.cellIndex = map.getCellIndex(x, y);

    // object image width and height
    this.width = CELL_SIZE;
    this.height = CELL_SIZE;

    // whether the object is collided
    this.collided = false;

    // whether the food is invalid
    this.invalid = false;
}

Food.prototype.update = function() {
    // check if the food is ate by the tanks
    for (var tankid in map.tanks) {
        var tank = map.tanks[tankid];

        if (!tank.isAlive) {
            continue;
        }

        var x;
        var y;
        switch (tank.faceDir) {
            case tank.NORTH:
                x = tank.x + tank.width/2;
                y = tank.y + 20;
                break;

            case tank.EAST:
                x = tank.x + tank.width - 20;
                y = tank.y + tank.height/2;
                break;

            case tank.SOUTH:
                x = tank.x + tank.width/2;
                y = tank.y + tank.height - 20;
                break;

            case tank.WEST:
                x = tank.x + 20;
                y = tank.y + tank.height/2;
                break;
        }

        if ( this.ate(x, y) ) {
            this.invalid = true;
            playSound(soundBuffers.eat_food);

            if (tank == localTank) {
                switch (this.foodType) {
                    case 'food_power_up':
                        if (localTank.defaultPowerLevel < 5) {
                            localTank.defaultPowerLevel++;
                        }
                        break;

                    case 'food_bullet':
                        localTank.maxFireCount++;
                        localTank.availableFireCount = localTank.maxFireCount;
                        break;

                    case 'food_hp':
                        localTank.HP += 20;
                        if (localTank.HP > localTank.maxHP) {
                            localTank.HP = localTank.maxHP;
                        }
                        localTank.hitInfos.push(new HitInfo(localTank.id, 20, localTank.x, localTank.y));
                        playSound(soundBuffers.absorbing);
                        break;

                    case 'food_speed_up':
                        localTank.speed += 1;
                        break;

                    case 'food_absorbing':
                        localTank.specialStatus = 0;
                        localTank.statusStartTime = Math.floor((new Date().getTime()) / 1000);
                        playSound(soundBuffers.special_status);
                        break;

                    case 'food_invincible':
                        localTank.specialStatus = 1;
                        localTank.statusStartTime = Math.floor((new Date().getTime()) / 1000);
                        playSound(soundBuffers.special_status);
                        break;

                    case 'food_invisible':
                        localTank.specialStatus = 2;
                        localTank.statusStartTime = Math.floor((new Date().getTime()) / 1000);
                        playSound(soundBuffers.special_status);
                        break;

                }
            }
        }

    }
}

Food.prototype.draw = function() {
    context.drawImage(images[this.foodType], this.x, this.y, this.width, this.height);
}

Food.prototype.ate = function(x, y) {
    var margin = 10;

    if ( x > this.x+margin && x < this.x+this.width-margin && y > this.y+margin && y < this.y+this.height-margin ) {
        return true;
    } else {
        return false;
    }

}