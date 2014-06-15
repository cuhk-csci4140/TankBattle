function HitInfo(tankid, number, x, y) {
    // frame to frame interval time
    this.INTERVAL_TIME = 0.05;

    this.objectType = HIT_INFO;

    this.id = tankid;
    this.hitNumber = number;
    this.x = x;
    this.y = y;
    this.width = 35;
    this.height = 35;
    this.interval = 0;
    this.phase = 0;
    this.invalid = false;
}

HitInfo.prototype.update = function() {
    this.interval++;
    this.phase = Math.floor(this.interval / (this.INTERVAL_TIME / (1/FPS))) % 9;

    // invalidate the explosion if finish explosion
    if (this.interval > 4 && this.phase == 0) {
        this.invalid = true;
    }

}

HitInfo.prototype.draw = function() {
    var imgName;
    switch (this.hitNumber) {
        case -1:
            imgName = 'minus_one';
            break;
        case -2:
            imgName = 'minus_two';
            break;
        case -3:
            imgName = 'minus_three';
            break;
        case -4:
            imgName = 'minus_four';
            break;
        case -5:
            imgName = 'minus_five';
            break;
        case 1:
            imgName = 'add_one';
            break;
        case 2:
            imgName = 'add_two';
            break;
        case 3:
            imgName = 'add_three';
            break;
        case 4:
            imgName = 'add_four';
            break;
        case 5:
            imgName = 'add_five';
            break;
        case 20:
            imgName = 'add_twenty';
            break;
    }

    context.drawImage(images[imgName], this.x+15, this.y+15-(this.phase*3), this.width, this.height);

}