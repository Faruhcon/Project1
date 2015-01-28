//Setup
var game = document.getElementById("gameCanvas");
var ctx = game.getContext("2d");

var loading, gameloop; //game loops
var score; //player's score
var start; //waits for player to press space bar
var maze; //maze for game
var blinky,pinky; //ghosts

function init(){
    //Get game and set width and height
    game = document.getElementById("gameCanvas");
    game.width = GAME_WIDTH;
    game.height = GAME_HEIGHT;
    //get context and set up initial background
    ctx = game.getContext("2d");
    ctx.font = GAME_FONTS;
    //Maze background
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,MAZE_WIDTH,MAZE_HEIGHT);
    //Score/Lives background
    ctx.fillStyle = "white";
    ctx.fillText(TEXT_LOADING, TEXT_LOADING_X, TEXT_LOADING_Y);


    //Make a new maze
    maze = new pacMaze(MAZE_WIDTH,MAZE_HEIGHT,TILEX,TILEY,moveGrid,coinGrid,"black","blue","pink");
    //Set up ghosts
    blinky = new ghost(GHOST_STARTX_RED/TILEX,GHOST_STARTY_RED/TILEY,"red",MAZE_WIDTH/TILEX,0,false,pacman,maze,BLINKY);
    pinky = new ghost(GHOST_STARTX_PINK/TILEX,GHOST_STARTY/TILEY,"pink",0,MAZE_HEIGHT/TILEY,true,pacman,maze,PINKY);
    generateGhost(blinky,pinky);

    //Initialize pacman, score, and lives
    pacman.restart();
    score = 0;
    pacman.numCoin = 0;
    lives = LIVES;
    //Add listener for keyboard
    window.addEventListener("keydown", onKeyDown, true);

    //Stay on start screen
    start = false;
    loading = setInterval(loadScreen, TIME_PER_FRAME);
}

function loadScreen(){
    if (start) {
        initStartScreen();
        clearInterval(loading);

        gameloop = setInterval(update, TIME_PER_FRAME);
    }
}

function initStartScreen(){
    //Clear Screen of Text
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,MAZE_WIDTH,MAZE_HEIGHT);
    //Display Score
    ctx.fillText(TEXT_SCORE+score,TEXT_SCORE_X,TEXT_SCORE_Y);
    //Display Lives
    ctx.fillText(TEXT_LIVES, TEXT_LIVES_X, TEXT_LIVES_Y);
    for (var i=0;i<lives;i++){ //draw lives (pacman)
        ctx.beginPath();
        ctx.arc(TEXT_LIVES_X + PAC_RADIUS+(i*PAC_RADIUS*2), TEXT_LIVES_Y + PAC_RADIUS + 5, PAC_RADIUS, RADIANS * 40, RADIANS * 320, false);
        ctx.lineTo(TEXT_LIVES_X + PAC_RADIUS+(i*PAC_RADIUS*2), TEXT_LIVES_Y + PAC_RADIUS + 5);
        ctx.fillStyle = "purple";
        ctx.fill();
    }
}

function update(){
    if (pacman.moving) {
        pacman.mouthSpeed = MOUTH_SPEED;
        //update next tile
        pacman.updateNextTile();
        //check if next tile is a wall
        if (maze.checkWall(pacman.nextX,pacman.nextY)){
            pacman.hitWall();
        }else if (maze.checkGhost(pacman.nextX,pacman.nextY)){ //if you hit a ghost you lose a life
            //Draw Maze
            maze.drawMaze(ctx,blinky,pinky);
            blinky.pause = true;
            pinky.pause = true;
            pacman.currX = pacman.nextX;
            pacman.currY = pacman.nextY;
            pacman.draw(TILEX,TILEY);
            maze.clearMoveGrid(moveGrid);
            loseLife();
        }else{ //if not a wall, update current tile and check for coins, power ups, and ghosts
            pacman.updateCurrentTile();
            if (maze.checkCoin(pacman.currX,pacman.currY)){
                updateScore(SCORE_COIN);
                pacman.numCoin +=1;
            }
        }
    }else{ //even if not moving, ghosts can still kill you
        if (maze.checkGhost(pacman.currX,pacman.currY)){
            blinky.pause = true;
            pinky.pause = true;
            maze.clearMoveGrid(moveGrid);
            loseLife();
        }
    }
    //update ghosts
    blinky.updateGhost();
    pinky.updateGhost();
    //Draw Maze
    maze.drawMaze(ctx,blinky,pinky);
    //Draw Player
    pacman.draw(TILEX,TILEY);
}

//updates the score onscreen
function updateScore(points){
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.fillRect(0, maze.height, GAME_WIDTH / 2, GAME_HEIGHT - maze.height);
    ctx.fill();
    ctx.fillStyle = "black";
    score += points;
    ctx.fillText(TEXT_SCORE+score,TEXT_SCORE_X,TEXT_SCORE_Y);
    ctx.closePath();
}

//handles what happens when a life is lost
function loseLife(){
    clearInterval(gameloop);
    pacman.moving = false;
    lives -= 1;
    pinky.coinCount = pacman.numCoin;
    //'Erase' a life
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(TEXT_LIVES_X+PAC_RADIUS+(PAC_RADIUS*lives*2), TEXT_LIVES_Y+PAC_RADIUS+5, PAC_RADIUS,RADIANS*40,RADIANS*320,false);
    ctx.lineTo(TEXT_LIVES_X + PAC_RADIUS+(lives*PAC_RADIUS*2), TEXT_LIVES_Y + PAC_RADIUS + 5);
    ctx.fill();
    ctx.closePath();

    //enter dying sequence
    pacman.dying = true;
    gameloop = setInterval(dying,TIME_PER_FRAME);
}

//used to animate dying for pacman
function dying(){
    //keep redrawing pacman until he disappears
    maze.clearTile(ctx,pacman.currX,pacman.currY);
    pacman.death(TILEX,TILEY);

    if (!pacman.dying){ //once pacman is done going through dying animation, reset board
        maze.clearTile(ctx,pacman.currX,pacman.currY);
        clearInterval(gameloop);
        pacman.restart();
        blinky.restart(); blinky.restartUpdate(GHOST_STARTX_RED/TILEX,GHOST_STARTY_RED/TILEY);
        pinky.restart(); pinky.restartUpdate(GHOST_STARTX_PINK/TILEX,GHOST_STARTY/TILEY);
        if (lives > 0){ //if there are lives remaining, continue playing
            pacman.draw(TILEX,TILEY);
            blinky.pause = false;
            pinky.pause = false;
            gameloop = setInterval(update, TIME_PER_FRAME);
        }else{ //otherwise, it's game over
            gameloop = setInterval(gameOver, TIME_PER_FRAME);
        }
    }
}

//game over sequence
function gameOver(){
       ctx.fillStyle = "black";
        ctx.fillRect(0,0,maze.width,maze.height);
        ctx.fillStyle = "white";
        ctx.fillText(TEXT_GAMEOVER,TEXT_GAMEOVER_X,TEXT_GAMEOVER_Y);

        if (start) {
            clearInterval(gameloop);
            init();
        }
}

//what happens for key presses
function onKeyDown(event){
    switch(event.keyCode) {
        case SPACE:
            start = true;
            break;
        case UP:
            pacman.updateFaceDirection(MOUTH_UP);
            pacman.moving = true;
            break;
        case DOWN:
            pacman.updateFaceDirection(MOUTH_DOWN);
            pacman.moving = true;
            break;
        case LEFT:
            pacman.updateFaceDirection(MOUTH_LEFT);
            pacman.moving = true;
            break;
        case RIGHT:
            pacman.updateFaceDirection(MOUTH_RIGHT);
            pacman.moving = true;
            break;
    }
}