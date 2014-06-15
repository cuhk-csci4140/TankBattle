function Explosion(explosionLevel, x, y) {
    // Explosion level
    this.MIN = 1;
    this.MIDDLE = 2;
    this.MAX = 3;

    // Explosion size in pixels
    this.MIN_FIRE = 25;
    this.MIDDLE_FIRE = 40;
    this.MAX_FIRE = 64;

    // frame to frame interval time
    this.INTERVAL_TIME = 0.05;

    // Properties
    this.objectType = EXPLOSION;
    this.explosionLevel = explosionLevel;
    this.x = x;
    this.y = y;
    this.phase = 0;
    this.frameIndex = 0;
    this.invalid = false;
}

Explosion.prototype.update = function() {
    this.phase++;
    this.frameIndex = Math.floor(this.phase / (this.INTERVAL_TIME / (1/FPS))) % 23;

    // invalidate the explosion if finish explosion
    if (this.phase > 10 && this.frameIndex == 0) {
        this.invalid = true;
    }
}

Explosion.prototype.draw = function() {
    var imgName = 'explosion_' + this.frameIndex;

    switch (this.explosionLevel) {
        case this.MIN:
            context.drawImage(images[imgName], this.x, this.y, this.MIN_FIRE, this.MIN_FIRE);
            break;

        case this.MIDDLE:
            context.drawImage(images[imgName], this.x, this.y, this.MIDDLE_FIRE, this.MIDDLE_FIRE);
            break;

        case this.MAX:
            context.drawImage(images[imgName], this.x, this.y, this.MAX_FIRE, this.MAX_FIRE);
            break;
    }

}

