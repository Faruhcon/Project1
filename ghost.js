/*
Defines ghost behavior.
There is a generic ghost with additions made for specific ghosts using generateGhost function.
 */

function ghost(x,y,color,sX,sY,house,pacman,maze,num){
    this.state = GHOST_SCATTER; //current state of ghost: determines movement behavior
    this.currX = x; //current x tile
    this.currY = y; //current y tile
    this.color = color; //color of ghost
    this.scatterX = sX; //target x tile for scatter mode
    this.scatterY = sY; //target y tile for scatter mode
    this.targetX = GHOST_STARTX_RED/TILEX -1; //target x tile (coordinate that ghost will move toward)
    this.targetY = GHOST_STARTY_RED/TILEY; //target y tile (coordinate that ghost will move toward)
    this.maze = maze; //reference to maze
    this.pacman = pacman; //reference to pacman
    this.movingDir = 0; //direction that ghost is moving in (UP/DOWN/LEFT/RIGHT)
    this.prevX = x; //previous x tile
    this.prevY = y; //previous y tile
    this.id = num; //ID of ghost (used in constructing maze)
    this.pause = false; //pauses behavior
    this.modeTimer = GHOST_SCATTER_TIMER; //timer for switching modes
    this.phase = 0; //used to set up a pattern for modes
    this.inHouse = house; //whether or not ghost is in the ghost house
    //resets to starting values when life is lost
    this.restart = function(){
        this.targetX = GHOST_STARTX_RED/TILEX-1;
        this.targetY = GHOST_STARTY_RED/TILEY;
        this.movingDir = 0;
        this.modeTimer = GHOST_SCATTER_TIMER;
        this.phase = 0;
    }
    //draws the ghost to screen
    this.draw = function(ctx,tw,th){
        ctx.beginPath();
        ctx.arc(this.currX*tw+PAC_RADIUS,this.currY*th+PAC_RADIUS,PAC_RADIUS,0,359);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    //updates the phase/phase timer  for ghost and switches mode when necessary
    this.updatePhase = function(){
        if (this.modeTimer > 0){
            this.modeTimer -= 1;
        }else{
            if (this.phase%2 == 0){
              this.phase += 1;

               this.switchChaseScatter(this.state);
            }else if (this.phase == 1 || this.phase == 3){
                this.phase += 1;
                this.switchChaseScatter(this.state);
            }else if (this.phase == 5){
                this.phase = 7;
                this.switchChaseScatter(this.state);
                this.modeTimer = 0;
            }else if (this.phase == 7){
                this.modeTimer = 0;
                this.phase = 7;
                this.state = GHOST_CHASE;
            }
        }
    }
    //handles the mode switching behavior for ghost
    this.switchChaseScatter = function(currState){
        this.prevState = currState;
        if (currState == GHOST_CHASE){
            this.state = GHOST_SCATTER;
            this.modeTimer = GHOST_SCATTER_TIMER;
        }else if (currState == GHOST_SCATTER){
            this.state = GHOST_CHASE;
            this.modeTimer = GHOST_CHASE_TIMER;
        }

        //reverse direction on mode change
        if (this.movingDir == LEFT){
            this.movingDir = RIGHT;
            this.targetX = this.currX+1;
            this.targetY = this.currY;
        }else if (this.movingDir == RIGHT){
            this.movingDir = LEFT;
            this.targetX = this.currX -1;
            this.targetY = this.currY;
        }else if (this.movingDir == UP){
            this.movingDir = DOWN;
            this.targetX = this.currX;
            this.targetY = this.currY+1;
        }else if (this.movingDir == DOWN){
            this.movingDir = UP;
            this.targetX = this.currX;
            this.targetY = this.currY-1;
        }
    }
    //updates the previous tile coordinates and updates moving direction
    this.updatePrevious = function(){
        if (this.prevY < this.currY){
            this.movingDir = DOWN;
        }else if (this.prevY > this.currY){
            this.movingDir = UP;
        }else if (this.prevX < this.currX){
            this.movingDir = RIGHT;
        }else if (this.prevX > this.currX){
            this.movingDir = LEFT;
        }else{
            this.movingDir = 0;
            return;
        }

        this.prevY = this.currY;
        this.prevX = this.currX;
    }
    //determines where the ghost will move next (tile that is the shortest distance from target tile without reversing direction)
    this.determineNextTile = function(){
        var newX = this.currX;
        var newY = this.currY;

        if (this.movingDir == 0){ //used for initial set up
            if (this.id == BLINKY) {
                newX = this.currX - 1;
                this.movingDir = LEFT;
            }else{
                newY = this.currY -1;
                this.movingDir = UP;
            }
        }else {
            var shortestDistance=1000;
            var distance;
            if (this.movingDir != DOWN && !this.maze.checkWall(this.currX, this.currY - 1)) {
                distance = ((this.currY - 1) - this.targetY) * ((this.currY - 1) - this.targetY) + (this.currX - this.targetX) * (this.currX - this.targetX);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    newX = this.currX;
                    newY = this.currY - 1;
                }
            }
            if (this.movingDir != UP && !this.maze.checkWall(this.currX, this.currY + 1)) {//this.faceDir != MOUTH_UP &&
                distance = ((this.currY + 1) - this.targetY) * ((this.currY + 1) - this.targetY) + (this.currX - this.targetX) * (this.currX - this.targetX);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    newX = this.currX;
                    newY = this.currY + 1;
                }
            }
            if (this.movingDir != RIGHT && !this.maze.checkWall(this.currX - 1, this.currY)) {//this.faceDir != MOUTH_RIGHT &&
                distance = (this.currY - this.targetY) * (this.currY - this.targetY) + ((this.currX - 1) - this.targetX) * ((this.currX - 1) - this.targetX);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    newX = this.currX - 1;
                    newY = this.currY;
                }
            }
            if (this.movingDir != LEFT && !this.maze.checkWall(this.currX + 1, this.currY)) {//this.faceDir != MOUTH_LEFT &&
                distance = (this.currY - this.targetY) * (this.currY - this.targetY) + ((this.currX + 1) - this.targetX) * ((this.currX + 1) - this.targetX);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    newX = this.currX + 1;
                    newY = this.currY;
                }
            }
        }
        this.currX = newX;
        this.currY = newY;
    }
}

//generates the ghost specific functions/variables
function generateGhost(red,pink){
    /*
    Red Ghost/Blinky
        Starts outside of ghost house
        Scatter ("home") target = top right of screen.
            In chase mode, target is pacman's current location.
    */
    red.updateTargetTile = function(){
        if (red.movingDir != 0) {
            if (red.state == GHOST_CHASE) {
                red.targetX = red.pacman.currX;
                red.targetY = red.pacman.currY;
            } else if (red.state == GHOST_SCATTER) {
                red.targetX = red.scatterX;
                red.targetY = red.scatterY;
            }
        }
    }
    red.updateGhost = function(){
        if (!red.pause) {
            red.maze.moveGrid[red.prevY][red.prevX] = 1;
            red.updatePrevious();
            red.updateTargetTile();
            red.updatePhase();
            red.determineNextTile();
            red.maze.moveGrid[red.currY][red.currX] = red.id;
        }
    }
    red.restartUpdate = function(cX,cY){
        red.currX = cX;
        red.currY = cY;
        red.prevX = cX;
        red.prevY = cY;
    }

    /*
     Pink Ghost/Pinky
         Starts inside ghost house but exits almost immediately
             Scatter ("home") target = bottom left of screen
             In chase mode, target is where pacman is going
                 (4 tiles straight ahead of pacman's current position, straight = direction pacman is facing)
                 This means his target CAN be behind him.
     */
    pink.updateTargetTile = function(){
        if (pink.movingDir != 0) {
            if (pink.state == GHOST_CHASE) {
                switch(pink.pacman.faceDir){
                    case MOUTH_UP:
                        pink.targetX = pink.pacman.currX;
                        pink.targetY = pink.pacman.currY-4;
                        break;
                    case MOUTH_DOWN:
                        pink.targetX = pink.pacman.currX;
                        pink.targetY = pink.pacman.currY+4;
                        break;
                    case MOUTH_LEFT:
                        pink.targetX = pink.pacman.currX-4;
                        pink.targetY = pink.pacman.currY;
                        break;
                    case MOUTH_RIGHT:
                        pink.targetX = pink.pacman.currX+4;
                        pink.targetY = pink.pacman.currY;
                        break;
                }
            } else if (pink.state == GHOST_SCATTER) {
                pink.targetX = pink.scatterX;
                pink.targetY = pink.scatterY;
            }
        }
    };
    pink.updateGhost = function(){
        if (!pink.pause && !pink.inHouse) {
            pink.maze.moveGrid[pink.prevY][pink.prevX] = 1;
            pink.updatePrevious();
            pink.updateTargetTile();
            pink.updatePhase();
            pink.determineNextTile();
            pink.maze.moveGrid[pink.currY][pink.currX] = pink.id;
        }else if (pink.inHouse){
            pink.maze.moveGrid[pink.prevY][pink.prevX] = 1;
            pink.checkExitHouse();
            pink.maze.moveGrid[pink.currY][pink.currX] = pink.id;
        }
    };
    pink.restartUpdate = function(cX,cY){
        pink.currX = cX;
        pink.currY = cY;
        pink.prevX = cX;
        pink.prevY = cY;
    }
    pink.coinCount = 0;
    pink.checkExitHouse = function(){
        if (pink.pacman.numCoin > pink.coinCount){
            pink.exitHouse();
        }
    };
    pink.exitHouse = function(){
        pink.targetX = GHOST_STARTX_RED/TILEX-1;
        pink.targetY = GHOST_STARTY_RED/TILEY;
        pink.updatePrevious();
        pink.determineNextTile();

        if (pink.currY == 10){
            pink.maze.moveGrid[9][8] = INVISIWALL;
            pink.maze.moveGrid[9][9] = INVISIWALL;
            pink.maze.moveGrid[9][10] = INVISIWALL;
        }else if (pink.currY < 9){
            inHouse = false;
            pink.maze.moveGrid[9][8] = GATE;
            pink.maze.moveGrid[9][9] = GATE;
            pink.maze.moveGrid[9][10] = GATE;
            pink.updateTargetTile();
        }
    };
}