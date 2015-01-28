//Balls placed around arena
var ball = {
    r: 5, //radius
    offset: 10, //offset to keep in center of walkway
    color: "green",
    //draws coin on screen
    draw: function(x,y){
        ctx.beginPath();
        ctx.arc(x+this.offset,y+this.offset,this.r,0,360,false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};