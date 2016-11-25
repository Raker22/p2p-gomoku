// P2P Gomoku
// Get 5 in a row taking turns placing stones on a 19x19 board
//
function Sprite(x, y, width, height, imageSrc) {
    this.x = x; // sprite offset from the left of the canvas
    this.y = y; // sprite offset from the top of the canvas
    this.width = width; // width of the sprite
    this.height = height; // height of the sprite
    this.image = new Image(); // sprite image

    this.setImage = function(imageSrc) {
        image.src = imageSrc;
    };

    this.draw = function() {
        // render the sprite to the canvas
        ctx.drawImage(image, x, y, width, height);
    };

    // set image src
    this.setImage(imageSrc);
}

function Board() {
    // extends sprite
    Sprite.call(this, 0, 0, canvas.width, canvas.height, null);

    this.lineColor = 0x000000; // line color
    this.data = []; // 2D array
    
    this.clearBoard = function() {
        // sets all cells to 0
        for(var i = 0; i < boardSize; i++){
            for(var j = 0; j < boardSize; j++) {
                data[i][j] = 0;
            }
        }
    };

    this.drawBoard = function() {
        // render the background and board lines
        board.draw();
        
        // draw the lines
        this._drawLines();
    };

    this._drawLines = function(){
        //draws lines on canvas to represent
        var count;
        //Horizontal Lines
        for(count = 0; count <= boardSize; count++)
        {
            ctx.beginPath();
            ctx.moveTo(50,50 + count*cellSize);
            ctx.lineTo(50 + cellSize*boardSize, 50 + count*cellSize);
            ctx.stroke();
            ctx.closePath();
        }
        //Vertical Lines
        for(count = 0; count <= boardSize; count++)
        {
            ctx.beginPath();
            ctx.moveTo(50 + count*cellSize,50);
            ctx.lineTo(50 + count*cellSize,50 + cellSize*boardSize);
            ctx.stroke();
            ctx.closePath();
        }
    };

    this.addStone = function(color, row, col) {
        // add the stone to the specified box
        board[row][col] = color;
        
        //Add Stone Sprite to canvas and refresh page
        
        
        // check for win
        return this.checkWin(color);
    };

    //Check all directions from(-5 -> 0 ) to (0 -> +5)
    this.checkWin = function(row, col, stoneColor) {
        var i;
        var check = false;
        
        for(i = 0; i < 6; i++)
        {
            //left/right check
            if((board.data[row-5+i,col] && board.data[row-4+i,col] &&
                board.data[row-3+i,col] && board.data[row-2+i,col] &&
                board.data[row-1+i,col] && board.data[row+i,col]) === stoneColor)
                check = true;
            //up/down check
            if((board.data[row,col-5+i] && board.data[row,col-4+i] &&
                board.data[row,col-3+i] && board.data[row,col-2+i] &&
                board.data[row,col-1+i] && board.data[row,col+i]) === stoneColor)
                check = true;    
            //LeftUp/RightDown Check
            if((board.data[row-5+i,col-5+i] && board.data[row-4+i,col-4+i] &&
                board.data[row-3+i,col-3+i] && board.data[row-2+i,col-2+i] &&
                board.data[row-1+i,col-1+i] && board.data[row+i,col+i]) === stoneColor)
                check = true;
            //RightUp/LeftDown Check
            
        }
        // check if the corresponding player won
        return false;
    };

    this.isEmpty = function(row, col) {
        // does the cell contain a stone
        return this.data[row][col] === EMPTY;
    };
    
    // initialization
    for (var i = 0; i < boardSize; i++) {
        // create board data
        var row = [];

        for (var n = 0; n < boardSize; n++) {
            row.push(0);
        }

        this.data.push(row);
    }
}

function Stone(color, row, col) {
    // extends Sprite
    Sprite.call(this, col * cellSize, row * cellSize, cellSize, cellSize, '' + color);
    
    this.color = color; // stone color
}

// constants
var WHITE = 1;
var EMPTY = 0;
var BLACK = -1;

// globals
var cellSize = 30;
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
