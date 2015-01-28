//Player/Pacman object
var pacman = {
    currX: 0, //current tile's grid column index
    currY: 0, //current tile's grid row index
    nextX: 0, //next tile's grid column index (determined by which direction pacman is facing)
    nextY: 0, //next tile's grid row index (determined by which direction pacman is facing)
    moving: false, //false = pacman not moving, true = moving
    r: PAC_RADIUS, //radius (in pixels)
    mouthAngle: 40, //start angle
    mouthOpenDir: 1, //1= mouth opening, -1 = mouth closing
    mouthSpeed: 0, //how fast mouth opens and closes
    faceDir: MOUTH_RIGHT, //determines direction pacman is facing (90,180,270,360)
    color: "yellow",
    canEatGhost: false,
    powerUp: false,
    dying: false,
    numCoin: 0,
    draw: function(){
        if (this.mouthAngle <= 0){
            this.mouthOpenDir = 1;
        }else if (this.mouthAngle >= 40){
            this.mouthOpenDir = -1;
        }
        this.mouthAngle += this.mouthSpeed * this.mouthOpenDir;

        ctx.beginPath();
        ctx.arc((this.currX*TILEX)+this.r,(this.currY*TILEY)+this.r, this.r, RADIANS*(this.faceDir+this.mouthAngle), RADIANS*(this.faceDir-this.mouthAngle-1), false);
        ctx.lineTo((this.currX*TILEX)+this.r,(this.currY*TILEY)+this.r);
        ctx.fillStyle = this.color;
        ctx.fill();
    },
    death: function(tileX,tileY){
        this.mouthOpenDir = 1;
        this.mouthSpeed = 20;
        if (this.mouthAngle+this.mouthSpeed < 180){
            this.mouthAngle += this.mouthSpeed;
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc((this.currX*tileX)+this.r, (this.currY*tileY)+this.r, this.r, RADIANS * (this.faceDir + this.mouthAngle), RADIANS * (this.faceDir - this.mouthAngle - 1), false);
            ctx.lineTo((this.currX*tileX)+this.r, (this.currY*tileY)+this.r);
            ctx.fill();
        }else{
            this.dying = false;
        }
    },
    restart: function(){
        this.mouthSpeed = 0;
        this.mouthOpenDir = 1;
        this.mouthAngle = 40;
        this.faceDir = MOUTH_RIGHT;
        this.currX = PAC_STARTX/TILEX;
        this.currY = PAC_STARTY/TILEY;
        this.nextX = this.currX+1;
        this.nextY = this.currY;
        this.moving = false;
    },
    hitWall: function(){
        this.mouthSpeed = 0;
        this.moving = false;
    },
    hitGhost: function(){
      this.mouthSpeed = 0;
        this.moving = false;
    },
    updateCurrentTile: function(){
        this.currX = this.nextX;
        this.currY = this.nextY;
    },
    updateNextTile: function(){
        switch (this.faceDir) {
            case MOUTH_UP:
                this.nextX = this.currX;
                this.nextY = this.currY-1;
                break;
            case MOUTH_DOWN:
                this.nextX = this.currX;
                this.nextY = this.currY+1;
                break;
            case MOUTH_LEFT:
                this.nextX = this.currX-1;
                this.nextY = this.currY;
                break;
            case MOUTH_RIGHT:
                this.nextX = this.currX+1;
                this.nextY = this.currY;
                break;
        }
    },
    updateFaceDirection: function(dir){
        this.faceDir = dir;
        this.updateNextTile();
    }

};