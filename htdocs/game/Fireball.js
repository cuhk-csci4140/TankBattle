function Fireball(owner, powerLevel, direction, x, y) {
    // ========== Contants ==============
    // Firing direction
    this.NORTH = 'north';
    this.SOUTH = 'south';
    this.WEST = 'west';
    this.EAST = 'east';

    // speed : pixels per second
    this.MIN_SPEED = 11;
    this.MIDDLE_SPEED = 13;
    this.MAX_SPEED = 15;

    // Properties
    this.owner = owner;
    this.powerLevel = powerLevel;
    this.direction = direction;
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.invalid = false;

    // play firing sound when new fire is created
    playSound(soundBuffers.fire);
}

Fireball.prototype.update = function() {
    // get explosion level
    var explosionLevel;
    if(this.powerLevel <= 2) {
        explosionLevel = 1;
    } else if(this.powerLevel <= 4) {
        explosionLevel = 2;
    } else {
        explosionLevel = 3;
    }

    // Check tank collisions
    for (var tankid in map.tanks) {

        // do not check collision with the tank which fire the fireball and when the tank is not alive
        if (tankid == this.owner || !map.tanks[tankid].isAlive) {
            continue;
        }

        var hitTank = false;

        // check and add explosion effect
        switch(this.direction) {
            case this.NORTH:
                if (map.tanks[tankid].hit(this.x+(this.width/2), this.y)) {
                    hitTank = true;
                    switch (explosionLevel) {
                        case 1:
                        case 2:
                            map.explosions.push(new Explosion(explosionLevel, this.x+20, this.y-20));
                            break;

                        case 3:
                            map.explosions.push(new Explosion(explosionLevel, this.x+10, this.y-35));
                            break;
                    }
                }
                break;

            case this.EAST:
                if (map.tanks[tankid].hit(this.x+this.width, this.y+(this.height/2))) {
                    hitTank = true;
                    switch (explosionLevel) {
                        case 1:
                        case 2:
                            map.explosions.push(new Explosion(explosionLevel, this.x+this.width, this.y+20));
                            break;

                        case 3:
                            map.explosions.push(new Explosion(explosionLevel, this.x+this.width-10, this.y+10));
                            break;
                    }
                }
                break;

            case this.SOUTH:
                if (map.tanks[tankid].hit(this.x+(this.width/2), this.y+this.height)) {
                    hitTank = true;
                    switch (explosionLevel) {
                        case 1:
                        case 2:
                            map.explosions.push(new Explosion(explosionLevel, this.x+20, this.y+this.height));
                            break;

                        case 3:
                            map.explosions.push(new Explosion(explosionLevel, this.x+10, this.y+this.height-10));
                            break;
                    }
                }
                break;

            case this.WEST:
                if (map.tanks[tankid].hit(this.x, this.y+(this.height/2))) {
                    hitTank = true;
                    switch (explosionLevel) {
                        case 1:
                        case 2:
                            map.explosions.push(new Explosion(explosionLevel, this.x-15, this.y+20));
                            break;

                        case 3:
                            map.explosions.push(new Explosion(explosionLevel, this.x-30, this.y));
                            break;
                    }
                }
                break;
        }

        if (hitTank) {
            // invalidate the fireball
            this.invalid = true;

            // Add hit info
            var tank =  map.tanks[tankid];
            if (tank.specialStatus == 0) {
                // energy absorbing
                tank.hitInfos.push(new HitInfo(tankid, this.powerLevel, map.tanks[tankid].x, map.tanks[tankid].y));
                playSound(soundBuffers.absorbing);
            } else if (tank.specialStatus == 1 ) {
                // invincible mode, do not decrease hp value
                playSound(soundBuffers.invincible_protected);
            } else {
                playSound(soundBuffers.explosion);
                tank.hitInfos.push(new HitInfo(tankid, -this.powerLevel, map.tanks[tankid].x, map.tanks[tankid].y));
            }


            // decrease hp value if the hit target is local tank
            if (tank == localTank) {

                if (tank.specialStatus == 0) {
                    // energy absorbing
                    localTank.HP += this.powerLevel;
                    if (localTank.HP > localTank.maxHP) {
                        localTank.HP = localTank.maxHP;
                    }
                } else if (tank.specialStatus == 1) {
                    // invincible mode, do not decrease hp value
                } else {
                    localTank.HP -= this.powerLevel;
                    if (localTank.HP < 0) {
                        localTank.HP = 0;
                    }
                }

                // destroy the tank is hp is 0
                if ( localTank.HP == 0) {
                    localTank.isAlive = false;
                    map.explosions.push(new Explosion(3, localTank.x, localTank.y));

                    // tell the game server that the tank is destroyed
                    setTimeout(function() {connection.send(JSON.stringify([TANK_DESTROYED, gameID])); }, 2000);
                }
            }

            return;
        }
    }

    // Check obstacle collisions
    var hitObstacle = false;
    var cellObj = null;
    var cellIndex = 0;
    // check and add explosion effect
    switch(this.direction) {
        case this.NORTH:
            if (map.cells[map.getCellIndex(this.x+(this.width/2), this.y-5)].collided) {
                cellIndex = map.getCellIndex(this.x+(this.width/2), this.y-5);
                cellObj = map.cells[cellIndex];
                hitObstacle = true;
                switch (explosionLevel) {
                    case 1:
                    case 2:
                        map.explosions.push(new Explosion(explosionLevel, this.x+20, this.y-15));
                        break;

                    case 3:
                        map.explosions.push(new Explosion(explosionLevel, this.x+10, this.y-25));
                        break;
                }
            }
            break;

        case this.EAST:
            if (map.cells[map.getCellIndex(this.x+this.width+10, this.y+(this.height/2))].collided) {
                cellIndex = map.getCellIndex(this.x+this.width+10, this.y+(this.height/2));
                cellObj = map.cells[cellIndex];
                hitObstacle = true;
                switch (explosionLevel) {
                    case 1:
                    case 2:
                        map.explosions.push(new Explosion(explosionLevel, this.x+this.width, this.y+20));
                        break;

                    case 3:
                        map.explosions.push(new Explosion(explosionLevel, this.x+this.width-10, this.y+10));
                        break;
                }
            }
            break;

        case this.SOUTH:
            if (map.cells[map.getCellIndex(this.x+(this.width/2), this.y+this.height+25)].collided) {
                cellIndex = map.getCellIndex(this.x+(this.width/2), this.y+this.height+25);
                cellObj = map.cells[cellIndex];
                hitObstacle = true;
                switch (explosionLevel) {
                    case 1:
                    case 2:
                        map.explosions.push(new Explosion(explosionLevel, this.x+20, this.y+this.height+10));
                        break;

                    case 3:
                        map.explosions.push(new Explosion(explosionLevel, this.x+10, this.y+this.height+10));
                        break;
                }
            }
            break;

        case this.WEST:
            if (map.cells[map.getCellIndex(this.x-10, this.y+(this.height/2))].collided) {
                cellIndex = map.getCellIndex(this.x-10, this.y+(this.height/2));
                cellObj = map.cells[cellIndex];
                hitObstacle = true;
                switch (explosionLevel) {
                    case 1:
                    case 2:
                        map.explosions.push(new Explosion(explosionLevel, this.x-15, this.y+20));
                        break;

                    case 3:
                        map.explosions.push(new Explosion(explosionLevel, this.x-30, this.y));
                        break;
                }
            }
            break;
    }

    if(hitObstacle) {
        // invalidate the fireball
        this.invalid = true;

        playSound(soundBuffers.explosion);

        // destroy the box if the fireball is fired by local player
        if (cellObj.objectType == BOX && this.owner == localPlayer) {
            cellObj.HP -= this.powerLevel;

            if (cellObj.HP <= 0) {
                map.explosions.push(new Explosion(3, cellObj.x, cellObj.y));
                var empty = new Empty(cellObj.x, cellObj.y);
                map.cells[cellIndex] = empty;
                destroyedBoxCellIndex = cellIndex;

                // generate food with the given probability
                var ranNum = Math.random();
                if (ranNum < FOOD_GENERATE_PROB) {

                    var foodName;
                    switch(Math.floor(Math.random() * 11) % 7) {
                        case 0:
                            foodName = 'food_power_up';
                            break;

                        case 1:
                            foodName = 'food_bullet';
                            break;

                        case 2:
                            foodName = 'food_hp';
                            break;

                        case 3:
                            foodName = 'food_speed_up';
                            break;

                        case 4:
                            foodName = 'food_absorbing';
                            break;

                        case 5:
                            foodName = 'food_invisible';
                            break;

                        case 6:
                            foodName = 'food_invincible';
                            break;

                    }

                    var food = new Food(cellObj.x, cellObj.y, foodName);
                    map.foods.push(food);
                    newFood = food;
                }
            }
        }

        return;
    }

    // Check wall collisions
    var hitWall = false;
    // check and add explosion effect
    switch(this.direction) {
        case this.NORTH:
            if (this.y < 0) {
                hitWall = true;
                switch (explosionLevel) {
                    case 1:
                        map.explosions.push(new Explosion(explosionLevel, this.x+(this.width/2), this.y-5));
                        break;
                    case 2:
                        map.explosions.push(new Explosion(explosionLevel, this.x+15, this.y-10));
                        break;
                    case 3:
                        map.explosions.push(new Explosion(explosionLevel, this.x, this.y-15));
                        break;
                }
            }
            break;

        case this.EAST:
            if ((this.x+this.width) > canvas.width) {
                hitWall = true;
                switch (explosionLevel) {
                    case 1:
                        map.explosions.push(new Explosion(explosionLevel, this.x+25, this.y+(this.height/2)));
                        break;
                    case 2:
                        map.explosions.push(new Explosion(explosionLevel, this.x+20, this.y+15));
                        break;
                    case 3:
                        map.explosions.push(new Explosion(explosionLevel, this.x, this.y));
                        break;
                }
            }
            break;

        case this.SOUTH:
            if ((this.y+this.height) > canvas.height) {
                hitWall = true;
                switch (explosionLevel) {
                    case 1:
                        map.explosions.push(new Explosion(explosionLevel, this.x+(this.width/2)-3, this.y+ 28));
                        break;
                    case 2:
                        map.explosions.push(new Explosion(explosionLevel, this.x+15, this.y+15));
                        break;
                    case 3:
                        map.explosions.push(new Explosion(explosionLevel, this.x, this.y));
                        break;
                }
            }
            break;

        case this.WEST:
            if (this.x < 0) {
                hitWall = true;
                switch (explosionLevel) {
                    case 1:
                        map.explosions.push(new Explosion(explosionLevel, this.x-5, this.y+(this.height/2)));
                        break;
                    case 2:
                        map.explosions.push(new Explosion(explosionLevel, this.x-10, this.y+15));
                        break;
                    case 3:
                        map.explosions.push(new Explosion(explosionLevel, this.x-5, this.y));
                        break;
                }
            }
            break;
    }

    if (hitWall) {
        this.invalid = true;
        playSound(soundBuffers.explosion);
        return;
    }

    // Do not hit anything,  move the fireball
    switch(this.direction) {
        case this.NORTH:
            if(this.powerLevel <= 2) {
                this.y -= this.MIN_SPEED;
            } else if(this.powerLevel <= 4) {
                this.y -= this.MIDDLE_SPEED;
            } else {
                this.y -= this.MAX_SPEED;
            }
            break;

        case this.EAST:
            if(this.powerLevel <= 2) {
                this.x += this.MIN_SPEED;
            } else if(this.powerLevel <= 4) {
                this.x += this.MIDDLE_SPEED;
            } else {
                this.x += this.MAX_SPEED;
            }
            break;

        case this.SOUTH:
            if(this.powerLevel <= 2) {
                this.y += this.MIN_SPEED;
            } else if(this.powerLevel <= 4) {
                this.y += this.MIDDLE_SPEED;
            } else {
                this.y += this.MAX_SPEED;
            }
            break;

        case this.WEST:
            if(this.powerLevel <= 2) {
                this.x -= this.MIN_SPEED;
            } else if(this.powerLevel <= 4) {
                this.x -= this.MIDDLE_SPEED;
            } else {
                this.x -= this.MAX_SPEED;
            }
            break;
    }
}

Fireball.prototype.draw = function() {

    var fireType;
    if(this.powerLevel <= 2) {
        fireType = 'min_fire';
    } else if(this.powerLevel <= 4) {
        fireType = 'middle_fire';
    } else {
        fireType = 'max_fire';
    }

    switch(this.direction) {
        case this.NORTH:
            fireType += '_north';
            context.drawImage(images[fireType], this.x+10, this.y-this.height+15, this.width, this.height);
            break;

        case this.EAST:
            fireType += '_east';
            context.drawImage(images[fireType], this.x+map.tanks[this.owner].width-15, this.y+10, this.width, this.height);
            break;

        case this.SOUTH:
            fireType += '_south';
            context.drawImage(images[fireType], this.x+10, this.y+map.tanks[this.owner].height-15, this.width, this.height);
            break;

        case this.WEST:
            fireType += '_west';
            context.drawImage(images[fireType], this.x-this.width+15, this.y+10, this.width, this.height);
            break;
    }

}