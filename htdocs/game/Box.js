function Box(x, y, boxType) {
    this.objectType = BOX;
    this.boxType = boxType;

    // object image top-left corner position
    this.x = x;
    this.y = y;

    // box hp value
    this.HP = 5;

    // object image width and height
    this.width = CELL_SIZE;
    this.height = CELL_SIZE;

    // whether the object is collided
    this.collided = true;
}

Box.prototype.draw = function() {
    context.drawImage(images[this.boxType], this.x, this.y, this.width, this.height);
}