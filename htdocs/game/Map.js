function Map(widthCellNum, heightCellNum, mapStr) {

    // Variables initializations
    this.widthCellNum = widthCellNum;
    this.heightCellNum = heightCellNum;
    this.mapStr = mapStr;

    this.cells = new Array();
    this.tanks = new Array();
    this.fireballs = new Array();
    this.explosions = new Array();
    this.foods = new Array();


    // Initialize canvas
    var canvasWidth = this.widthCellNum * CELL_SIZE;
    var canvasHeight = this.heightCellNum * CELL_SIZE;
    var canvasContainerWidth = canvasWidth;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvasContainer.style.width = canvasContainerWidth+'px';

    // Create tank objects
    var len = players.length;
    for (var i = 0; i < len; i++) {
        var tank = new Tank(players[i].pos, players[i].id);
        this.tanks[players[i].id] = tank;
    }

    // Create map objects
    var len = mapStr.length;
    for (var i = 0; i < len; i++) {
        var char = mapStr.charAt(i);
        var xPos = ( i % this.widthCellNum) * CELL_SIZE;
        var yPos = Math.floor( i / this.heightCellNum) * CELL_SIZE;

        switch (char) {
            case ' ':
                // empty cell
                var empty = new Empty(xPos, yPos);
                this.cells[i] = empty;
                break;

            case 'X':
                // obstacle: brown stone
                var brownStone = new Obstacle(xPos, yPos, 'brown_stone');
                this.cells[i] = brownStone;
                break;

            case 'Z':
                // obstacle: ice
                var ice = new Obstacle(xPos, yPos, 'ice');
                this.cells[i] = ice;
                break;

            case 'C':
                // obstacle: tree1
                var tree = new Obstacle(xPos, yPos, 'tree1');
                this.cells[i] = tree;
                break;

            case 'V':
                // obstacle: tree2
                var tree = new Obstacle(xPos, yPos, 'tree2');
                this.cells[i] = tree;
                break;

            case 'q':
            case 'w':
            case 'e':
            case 'r':
            case 't':
            case 'y':
            case 'u':
                // boxes:
                var box = new Box(xPos, yPos, 'box_'+char);
                this.cells[i] = box;
                break;
        }
    }

}

Map.prototype.clearMap = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

Map.prototype.getCellIndex = function(x, y) {
    var col = 0;
    var row = 0;

    if (x > 0) {
        col = Math.floor( x / 60 );
        if (col >= this.widthCellNum) {
            col = this.widthCellNum - 1;
        }
    }

    if (y > 0) {
        row = Math.floor( y / 60 );
        if (row >= this.heightCellNum) {
            row = this.heightCellNum - 1;
        }
    }

    return row * this.widthCellNum + col;
}