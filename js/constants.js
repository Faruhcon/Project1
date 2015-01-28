//Game Vars
var GAME_WIDTH = 380, //width of game window (in pixels)
    GAME_HEIGHT = 640, //height of game window (in pixels)
    TIME_PER_FRAME = 200,
    GAME_FONTS = "bold 20px sans-serif";
var RADIANS = Math.PI/180;
var SCORE_COIN = 10, //how much to increase score for a single coin
    LIVES = 3; //number of lives

//Dimensions and Spawn Locations (all in pixels)
var TILEX = 20, //how wide one "tile" (movement block) is
    TILEY = 20, //how tall one "tile" (movement block) is
    PAC_RADIUS = 10, //radius of pacman
    PAC_STARTX = (9*TILEX),//+PAC_RADIUS, //x coord for pacman spawn
    PAC_STARTY = (14*TILEY),//+PAC_RADIUS, //y coord for pacman spawn
    GHOST_STARTX_RED = 9*TILEX, //x coord for Blinky spawn
    GHOST_STARTX_PINK = 8*TILEX, //x coord for Pinky spawn
    GHOST_STARTY = 11*TILEY,//y coord for Pinky,Inky, and Clyde spawns
    GHOST_STARTY_RED = 8*TILEY,//y coord for Blinky spawn
    MAZE_WIDTH = 380, //width for maze
    MAZE_HEIGHT = 440; //height for maze

//Speeds
var MOUTH_SPEED = 20; //how many degrees pacman's mouth moves per frame

//movement directions for mouth angle
var MOUTH_UP = 270, //reference angle for pacman moving up
    MOUTH_DOWN = 90, //reference angle for pacman moving down
    MOUTH_LEFT = 180, //reference angle for pacman moving left
    MOUTH_RIGHT = 360; //reference angle for pacman moving right

//Ghost Behavior
var GHOST_SCATTER = 0,
    GHOST_CHASE = 1,
    GHOST_SCATTER_TIMER = 7,
    GHOST_CHASE_TIMER = 20;

//control key codes
var SPACE = 32, //space key
    UP = 38, //up arrow key
    DOWN = 40, //down arrow key
    LEFT = 37, //left arrow key
    RIGHT = 39; //right arrow key

//Text-Related Vars
var TEXT_LOADING = "Press Space to Start", //LOADING message
    TEXT_LOADING_X = 100, //Left position of LOADING message
    TEXT_LOADING_Y = 220; //Top position of LOADING message

var TEXT_GAMEOVER = "GAME OVER", //Game Over Screen Message
    TEXT_GAMEOVER_X = 100, //Left position of Game Over Screen Message
    TEXT_GAMEOVER_Y = 200; //Top position of Game Over Screen Message

var TEXT_LIVES = "Lives: ",
    TEXT_LIVES_X = 200,
    TEXT_LIVES_Y = 470;

var TEXT_SCORE = "Score: ",
    TEXT_SCORE_X = 20,
    TEXT_SCORE_Y = 470;

//Vars for decoding grid
var BLINKY = 5,
    PINKY = 6,
    PACMAN = 4,
    GATE = 2;
    INVISIWALL = 3
    WALL = 0
    WALKWAY = 1,
    COIN = 1;

//Maze Grid Array: 0 = wall, 1 = open (19Wide x 22Tall)
var grid = [ //starting grid for game
    [0,0,0, 0,0,0,0, 0,0,0,0,0, 0,0,0,0, 0,0,0],
    [0,1,1, 1,1,1,1, 1,1,0,1,1, 1,1,1,1, 1,1,0],
    [0,1,0, 0,1,0,0, 0,1,1,1,0, 0,0,1,0, 0,1,0],
    [0,1,0, 0,1,0,0, 0,1,1,1,0, 0,0,1,0, 0,1,0],
    [0,1,1, 1,1,1,1, 1,1,0,1,1, 1,1,1,1, 1,1,0],
    [0,1,0, 0,1,0,1, 0,0,0,0,0, 1,0,1,0, 0,1,0],

    [0,1,1, 1,1,0,1, 1,1,0,1,1, 1,0,1,1, 1,1,0],
    [0,0,1, 0,1,0,0, 0,1,0,1,0, 0,0,1,0, 1,0,0],
    [0,1,1, 0,1,1,1, 1,1,1,1,1, 1,1,1,0, 1,1,0],
    [0,1,0, 0,1,0,1, 0,0,0,0,0, 1,0,1,0, 0,1,0],
    [0,1,1, 1,1,0,1, 0,1,1,1,0, 1,0,1,1, 1,1,0],

    [0,1,0, 0,1,0,1, 0,1,1,1,0, 1,0,1,0, 0,1,0],
    [0,1,1, 0,1,0,1, 0,1,1,1,0, 1,0,1,0, 1,1,0],
    [0,0,1, 0,1,0,1, 0,0,0,0,0, 1,0,1,0, 1,0,0],
    [0,1,1, 1,1,1,1, 1,1,1,1,1, 1,1,1,1, 1,1,0],
    [0,1,0, 0,1,0,0, 0,1,0,1,0, 0,0,1,0, 0,1,0],

    [0,1,1, 0,1,1,1, 1,1,0,1,1, 1,1,1,0, 1,1,0],
    [0,0,1, 0,1,0,1, 0,0,0,0,0, 1,0,1,0, 1,0,0],
    [0,1,1, 1,1,0,1, 1,1,0,1,1, 1,0,1,1, 1,1,0],
    [0,1,0, 0,1,0,0, 0,1,0,1,0, 0,0,1,0, 0,1,0],
    [0,1,1, 1,1,1,1, 1,1,1,1,1, 1,1,1,1, 1,1,0],
    [0,0,0, 0,0,0,0, 0,0,0,0,0, 0,0,0,0, 0,0,0]
];

var coinGrid = [ //starting coin layout
    [0,0,0, 0,0,0,0, 0,0,0,0,0, 0,0,0,0, 0,0,0],
    [0,1,1, 1,1,1,1, 1,1,0,1,1, 1,1,1,1, 1,1,0],
    [0,1,0, 0,1,0,0, 0,1,1,1,0, 0,0,1,0, 0,1,0],
    [0,1,0, 0,1,0,0, 0,1,1,1,0, 0,0,1,0, 0,1,0],
    [0,1,1, 1,1,1,1, 1,1,0,1,1, 1,1,1,1, 1,1,0],
    [0,1,0, 0,1,0,1, 0,0,0,0,0, 1,0,1,0, 0,1,0],

    [0,1,1, 1,1,0,1, 1,1,0,1,1, 1,0,1,1, 1,1,0],
    [0,0,1, 0,1,0,0, 0,1,0,1,0, 0,0,1,0, 1,0,0],
    [0,1,1, 0,1,1,1, 1,1,1,1,1, 1,1,1,0, 1,1,0],
    [0,1,0, 0,1,0,1, 0,0,0,0,0, 1,0,1,0, 0,1,0],
    [0,1,1, 1,1,0,1, 0,0,0,0,0, 1,0,1,1, 1,1,0],

    [0,1,0, 0,1,0,1, 0,0,0,0,0, 1,0,1,0, 0,1,0],
    [0,1,1, 0,1,0,1, 0,0,0,0,0, 1,0,1,0, 1,1,0],
    [0,0,1, 0,1,0,1, 0,0,0,0,0, 1,0,1,0, 1,0,0],
    [0,1,1, 1,1,1,1, 1,1,0,1,1, 1,1,1,1, 1,1,0],
    [0,1,0, 0,1,0,0, 0,1,0,1,0, 0,0,1,0, 0,1,0],

    [0,1,1, 0,1,1,1, 1,1,0,1,1, 1,1,1,0, 1,1,0],
    [0,0,1, 0,1,0,1, 0,0,0,0,0, 1,0,1,0, 1,0,0],
    [0,1,1, 1,1,0,1, 1,1,0,1,1, 1,0,1,1, 1,1,0],
    [0,1,0, 0,1,0,0, 0,1,0,1,0, 0,0,1,0, 0,1,0],
    [0,1,1, 1,1,1,1, 1,1,1,1,1, 1,1,1,1, 1,1,0],
    [0,0,0, 0,0,0,0, 0,0,0,0,0, 0,0,0,0, 0,0,0]
];

var moveGrid = [ //starting movement layout
    [0,0,0, 0,0,0,0, 0,0,0,0,0, 0,0,0,0, 0,0,0],
    [0,1,1, 1,1,1,1, 1,1,0,1,1, 1,1,1,1, 1,1,0],
    [0,1,0, 0,1,0,0, 0,1,1,1,0, 0,0,1,0, 0,1,0],
    [0,1,0, 0,1,0,0, 0,1,1,1,0, 0,0,1,0, 0,1,0],
    [0,1,1, 1,1,1,1, 1,1,0,1,1, 1,1,1,1, 1,1,0],
    [0,1,0, 0,1,0,1, 0,0,0,0,0, 1,0,1,0, 0,1,0],

    [0,1,1, 1,1,0,1, 1,1,0,1,1, 1,0,1,1, 1,1,0],
    [0,0,1, 0,1,0,0, 0,1,0,1,0, 0,0,1,0, 1,0,0],
    [0,1,1, 0,1,1,1, 1,1,5,1,1, 1,1,1,0, 1,1,0],
    [0,1,0, 0,1,0,1, 0,2,2,2,0, 1,0,1,0, 0,1,0],
    [0,1,1, 1,1,0,1, 0,3,3,3,0, 1,0,1,1, 1,1,0],

    [0,1,0, 0,1,0,1, 0,3,6,3,0, 1,0,1,0, 0,1,0],
    [0,1,1, 0,1,0,1, 0,3,3,3,0, 1,0,1,0, 1,1,0],
    [0,0,1, 0,1,0,1, 0,0,0,0,0, 1,0,1,0, 1,0,0],
    [0,1,1, 1,1,1,1, 1,1,4,1,1, 1,1,1,1, 1,1,0],
    [0,1,0, 0,1,0,0, 0,1,0,1,0, 0,0,1,0, 0,1,0],

    [0,1,1, 0,1,1,1, 1,1,0,1,1, 1,1,1,0, 1,1,0],
    [0,0,1, 0,1,0,1, 0,0,0,0,0, 1,0,1,0, 1,0,0],
    [0,1,1, 1,1,0,1, 1,1,0,1,1, 1,0,1,1, 1,1,0],
    [0,1,0, 0,1,0,0, 0,1,0,1,0, 0,0,1,0, 0,1,0],
    [0,1,1, 1,1,1,1, 1,1,1,1,1, 1,1,1,1, 1,1,0],
    [0,0,0, 0,0,0,0, 0,0,0,0,0, 0,0,0,0, 0,0,0]
];
