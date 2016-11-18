// P2P Gomoku
// Get 5 in a row taking turns placing stones on a 19x19 board

function Sprite(x, y, width, height, imageSrc) {
    this.x = x; // sprite offset from the left of the canvas
    this.y = y; // sprite offset from the top of the canvas
    this.width = width; // width of the sprite
    this.height = height; // height of the sprite
    this.image = new Image(); // sprite image

    this.setImage = function(imageSrc) {
        // set the image src
    };

    this.draw = function() {
        // render the sprite
    };

    // set image src
    this.setImage(imageSrc);
}

function Board() {
    // extends Sprite

    this.lineColor = 0x000000; // line color
    this.data = [];

    this.draw = function() {
        // render the background and board lines
        Sprite.draw.call(this);
        
        // draw the lines
        this._drawLines();
    };

    this._drawLines = function(){
        //draws lines on canvas to represent
    };

    this.addStone = function(color, row, col) {
        // add the stone to the specified box

        // check for win
        return this.checkWin(color);
    };

    this.checkWin = function(stoneColor) {
        // check if the corresponding player won
        return false;
    };

    this.isEmpty = function(row, col) {
        return this.data[row][col] === EMPTY;
    };

    // init data to boardSize x boardSize array of 0s
}

function Stone(color) {
    // extends Sprite

    this.stoneColor = color === WHITE ? 'white' : 'black'; // stone color

    // set image based on stone color
}

// constants
var WHITE = 1;
var EMPTY = 0;
var BLACK = -1;

// globals
var boardSize = 19;
var canvas = document.getElementById('canvas'); // canvas to be render to
var ctx = canvas.getContext('2d'); // canvas context
var me = new Peer({}); // this player's peer connection
var connection = null; // connection to the other player
var myTurn = false;

canvas.on('mouseup', function(e) {
    // place a stone in the box clicked if it is this player's turn and it is empty
    myTurn = false;
    // e.offsetX
});

// connect to player
// set up connection

// receive connection
// set up connection
