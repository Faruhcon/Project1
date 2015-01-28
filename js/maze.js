/*
    Defines the maze for the game.
 */
function pacMaze(w,h,tw,th,mGrid,cGrid,bg,wall,gate){
    this.width = w; //width of maze
    this.height = h; //height of maze
    this.tileWidth = tw; //width of a single movement tile
    this.tileHeight = th; //height of a single movement tile
    this.moveGrid = mGrid.map(function(arr) { return arr.slice();}); //copy mGrid to moveGrid, used to update pacman/ghost locations
    this.coinGrid = cGrid.map(function(arr) { return arr.slice();}); //copy cGrid to coinGrid, used to maintain ccoins on screen
    this.background = bg; //background color of maze
    this.wallColor = wall; //color of maze walls
    this.gateColor = gate; //color of "gate" to ghost house
    //draws the maze from the movement grid (walls+ghosts) and coin grid (coins)
    this.drawMaze = function(ctx,b,p){
        //Clear Canvas
        ctx.fillStyle = this.background;
        ctx.fillRect(0,0,this.width,this.height);
        //then step through grids to draw ghosts, walls, and coins
        for (var row = 0; row < this.moveGrid.length; row++){
            for (var column = 0; column < this.moveGrid[row].length; column++){
                if (this.moveGrid[row][column] == 0){ //draw a wall
                    this.drawWall(ctx,this.wallColor,column*this.tileWidth,row*this.tileHeight,this.tileWidth,this.tileHeight);
                }else if (this.moveGrid[row][column] == BLINKY){ //draw blinky
                    if (this.coinGrid[row][column]==COIN){ //draw coin behind blinky if there is one
                        ball.draw(column*this.tileWidth,row*this.tileHeight);
                    }
                    b.draw(ctx,TILEX,TILEY);
                }else if (this.moveGrid[row][column] == PINKY){ //draw pinky
                    if (this.coinGrid[row][column]==COIN){ //draw coin behind pinky if there is one
                        ball.draw(column*this.tileWidth,row*this.tileHeight);
                    }
                    p.draw(ctx,TILEX,TILEY);
                }else if (this.moveGrid[row][column] == GATE){ //draw gate
                    this.drawWall(ctx,this.gateColor,column*this.tileWidth,row*this.tileHeight+15,this.tileWidth,this.tileHeight/3);
                }else if (this.coinGrid[row][column]==COIN){ //draw coins
                    ball.draw(column*this.tileWidth,row*this.tileHeight);
                }
            }
        }
    }
    //helper function to draw walls
    this.drawWall = function(ctx,color,x,y,w,h){
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.fillRect(x,y,w,h);
        ctx.fill();
        ctx.closePath();
    }
    //helper function to check if a certain tile contains a coin
    this.checkCoin = function(x,y){
        if (this.coinGrid[y][x] == 1) {
            this.coinGrid[y][x] = 0;
            return true;
        }else{
            return false;
        }
    }
    //helper function to heck if a certain tile contains a ghost
    this.checkGhost = function(gX,gY){
        return (this.moveGrid[gY][gX] == BLINKY || this.moveGrid[gY][gX] == PINKY);
    }
    //helper function to "clear" a tile (fill in with background)
    this.clearTile = function(ctx,x,y){
        ctx.fillStyle = this.background;
        ctx.fillRect(x*this.tileWidth,y*this.tileHeight,this.tileWidth,this.tileHeight);
        ctx.fill();
    }
    //helper function to check if a certain tile contains a wall
    this.checkWall = function(nX,nY){
        return (this.moveGrid[nY][nX] == WALL || this.moveGrid[nY][nX] == GATE ||
                this.moveGrid[nY][nX] == INVISIWALL);
    }
    //resets move grid to initial state
    this.clearMoveGrid = function(mGrid){
        this.moveGrid = mGrid.map(function(arr) { return arr.slice();}); //copy mGrid to moveGrid
    }
}



