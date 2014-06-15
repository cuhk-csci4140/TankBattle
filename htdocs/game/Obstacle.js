function Obstacle(x, y, obstacleType) {

    this.objectType = OBSTACLE;
    this.obstacleType = obstacleType;

    // object image top-left corner position
    this.x = x;
    this.y = y;

    // object image width and height
    this.width = CELL_SIZE;
    this.height = CELL_SIZE;

    // whether the object is collided
    this.collided = true;
}

Obstacle.prototype.draw = function() {
    context.drawImage(images[this.obstacleType], this.x, this.y, this.width, this.height);
}