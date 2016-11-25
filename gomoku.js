// P2P Gomoku
// Get 5 in a row taking turns placing stones on a 19x19 board
//
function Sprite(x, y, width, height, imageSrc) {
    var self = this;
    this.x = x; // sprite offset from the left of the canvas
    this.y = y; // sprite offset from the top of the canvas
    this.width = width; // width of the sprite
    this.height = height; // height of the sprite
    this.image = new Image(); // sprite image

    // set the sprite to render whenever the image is loaded
    this.image.addEventListener('load', function() {
        self.draw();
    });
    // set image src
    this.setImage(imageSrc);
}

Sprite.prototype.setImage = function(imageSrc) {
    this.image.src = imageSrc;
};

Sprite.prototype.draw = function() {
    // render the sprite to the canvas
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
};

function Board() {
    // extends sprite
    Sprite.call(this, 0, 0, canvas.width, canvas.height, 'src/board.jpg');

    this.lineColor = 0x000000; // line color
    this.data = []; // 2d array of cells
    this.numStones = 0;
    
    for (var i = 0; i < BOARD_SIZE; i++) {
        // create board data
        var row = [];

        for (var n = 0; n < BOARD_SIZE; n++) {
            row.push(0);
        }

        this.data.push(row);
    }

    this.draw();
}

Board.prototype = Object.create(Sprite.prototype);

Board.prototype.clear = function() {
    // sets all cells to 0
    for(var i = 0; i < BOARD_SIZE; i++){
        for(var j = 0; j < BOARD_SIZE; j++) {
            this.data[i][j] = 0;
        }
    }

    this.numStones = 0;
    this.draw();
};

Board.prototype.draw = function() {
    // render the background and board lines
    Sprite.prototype.draw.call(this);
    
    // draw the lines
    this._drawLines();
};

Board.prototype._drawLines = function(){
    //draws lines on canvas to represent
    var count;
    //Horizontal Lines
    for(count = 0; count <= BOARD_SIZE; count++)
    {
        ctx.beginPath();
        ctx.moveTo(0, count * cellSize);
        ctx.lineTo(canvas.width, count * cellSize);
        ctx.stroke();
        ctx.closePath();
    }
    //Vertical Lines
    for(count = 0; count <= BOARD_SIZE; count++)
    {
        ctx.beginPath();
        ctx.moveTo(count * cellSize, 0);
        ctx.lineTo(count * cellSize, canvas.height);
        ctx.stroke();
        ctx.closePath();
    }
};

Board.prototype.addStone = function(color, row, col) {
    // add the stone to the specified box
    this.data[row][col] = color;
    
    //Add Stone Sprite to canvas and refresh page
    new Stone(color, row, col);
    this.numStones++;
    
    // check for win
    return this.checkWin(color, row, col);
};

Board.prototype.checkWin = function(color, row, col) {
    // check if the corresponding player won
    var checkRow = row;
    var checkCol = col;

    for (var i = 0; i < WIN_DIRECTIONS.length; i++) {
        // check each direction starting at the stone
        var numInRow = 1; // this stone plus the other stones in the line

        for (var n = 1; n >= -1; n -= 2) {
            // check in the direction and the opposite
            var dRow = WIN_DIRECTIONS[i][0] * n;
            var dCol = WIN_DIRECTIONS[i][1] * n;
            var checkRow = row + dRow;
            var checkCol = col + dCol;

            while (this.isValid(checkRow, checkCol) && this.data[checkRow][checkCol] === color) {
                // continue until the edge of the board or not this color is reached
                numInRow++;
                checkRow += dRow;
                checkCol += dCol;
            }

            if (numInRow >= NUM_TO_WIN) {
                // there are enough in a row so someone won
                return true;
            }
        }
    }

    // if we got to the end then 
    return false;
};

Board.prototype.isValid = function(row, col) {
    // space is on the board
    return row >= 0 &&
        row < BOARD_SIZE &&
        col >= 0 &&
        col < BOARD_SIZE;
};

Board.prototype.isEmpty = function(row, col) {
    // check if the space is open
    return this.data[row][col] === EMPTY;
};

function Stone(color, row, col) {
    // extends Sprite
    Sprite.call(this, col * cellSize, row * cellSize, cellSize, cellSize, 'src/stone' + color + '.png');
    
    this.color = color; // stone color
}

Stone.prototype = Object.create(Sprite.prototype);

// constants
var WHITE = 1;
var EMPTY = 0;
var BLACK = -1; // plays first
var WIN_DIRECTIONS = [[1,0], [0,1], [1,1], [1,-1]]; // directions you can win in
var BOARD_SIZE = 19; // number of spaces on the playing board
var NUM_TO_WIN = 5; // number of stones in a row to win

// info strings
var INFO_START = 'Enter a player\'s ID and click "Connect" to play Gomoku with them.';
var INFO_TURN = 'Click an empty square to place a stone.';
var INFO_WAIT = 'Wait for the other player to place a stone.';
var INFO_WON = ' won the game.';
var INFO_DRAW = 'Draw game against player ';

// html elements
var canvas = document.getElementById('canvas'); // canvas to be render to
var myId = document.getElementById('my_id'); // element that displays the user's id
var opponentId = document.getElementById('opponent_id'); // element containing the opponent's id
var connectButton = document.getElementById('connect_button'); // button the user clicks to start a game
var connectionSpinner = document.getElementById('connection_spinner'); // spinner for waiting to connect
var infoDisplay = document.getElementById('info'); // where info is displayed to the user
var turnSpinner = document.getElementById('turn_spinner'); // spinner for waiting for opponent turn 

// globals
var ctx = canvas.getContext('2d'); // canvas context
var me = new Peer({ key: 'djdn2sprx3kdquxr' }); // user's peer connection
var connection = null; // connection to the other player
var myTurn = false; // who's turn is it?
var color = null; // user's stone color
var cellSize = canvas.width / BOARD_SIZE; // size of a board square
var board = new Board(); // the game board

function connect() {
    // attempt to connect if the user has entered an opponent id
    var opponent = opponentId.value;

    if (opponent.length > 0) {
        // disable connection elements
        disableConnect(true);

        // show connection spinner
        show(connectionSpinner);

        // connect to player
        var conn = me.connect(opponent);

        // set up connection
        conn.on('open', function() {
            // connection has been established and is ready to use
            hide(connectionSpinner);
            color = BLACK;
            setupConnection(conn);
            board.clear();
            // initiating player makes first move
            info.innerHTML = INFO_TURN;
            myTurn = true;
        });
    }
    else {
        alert('Enter the ID of a player to connect to');
    }
}

function setupConnection(conn) {
    conn.on('data', function(data) {
        // receive row and column where the opponent played a stone
        var row = data.row;
        var col = data.col;

        // place the stone
        if (board.addStone(color * -1, row, col)) {
            // the other player won
            info.innerHTML = 'Player "' + opponentId.value + '"' + INFO_WON;
            connection.close();
        }
        else {
            // set to the user's turn
            if (board.numStones === BOARD_SIZE * BOARD_SIZE) {
                // draw game
                info.innerHTML = INFO_DRAW + '"' + opponentId.value + '"' + '.';
                connection.close();
            }
            else {
                // wait for a cell to be clicked
                info.innerHTML = INFO_TURN + ' Last stone placed at (' + row + ',' + col + ').';
                hide(turnSpinner);
                myTurn = true;
            }
        }
    });

    conn.on('close', function() {
        // disable the user's ability to play stones
        myTurn = false;
        // enable opponentId and connectButton
        hide(turnSpinner);
        disableConnect(false);
        connection = null;
    });

    conn.on('error', function(err) {
        // alert the user
        alertError(err);
        // close the connection
        connection.close();
    });

    connection = conn;
}

function disableConnect(disabled) {
    // enable/disable opponentId and connectButton
    opponentId.disabled = disabled;
    connectButton.disabled = disabled;
}

function alertError(err) {
    // alert the user of the error
    alert('Error: ' + err.type);
}

function show(element) {
    // display the element
    element.style.visibility = 'visible';
}

function hide(element) {
    // hide the element
    element.style.visibility = 'hidden';
}

canvas.addEventListener('click', function(e) {
    if (myTurn) {
        // place a stone in the box clicked if it is this player's turn and it is empty
        // determine row and column
        var row = Math.floor(e.offsetY / cellSize);
        var col = Math.floor(e.offsetX / cellSize);

        if (board.isEmpty(row, col)) {
            // stone can be placed there
            if (board.addStone(color, row, col)) {
                // the user won
                info.innerHTML = 'You' + INFO_WON;
            }
            else {
                // inform the user that we are waiting on their opponent
                if (board.numStones === BOARD_SIZE * BOARD_SIZE) {
                    // draw game
                    info.innerHTML = INFO_DRAW + '"' + opponentId.value + '"' + '.';
                }
                else {
                    // wait for opponent
                    show(turnSpinner);
                    info.innerHTML = INFO_WAIT;
                }
            }

            myTurn = false;
            connection.send({ row: row, col: col });
        }
        else {
            alert('There is already a stone at (' + row + ',' + col + ')');
        }
    }
});

me.on('open', function() {
    // update my id when connection to server is established
    myId.innerHTML = me.id;
});

me.on('connection', function(conn) {
    if (connection === null) {
        // if not connected disable set peer id and disable connection elements
        opponentId.value = conn.peer;
        disableConnect(true);

        // set up connection initiated by other player
        connection = conn;
        color = WHITE;
        setupConnection(connection);
        board.clear();
        // player being connected to waits
        show(turnSpinner);
        info.innerHTML = INFO_WAIT;
    }
});

me.on('error', function(err) {
    if (err.type === 'peer-unavailable') {
        // if the player doesn't exist inform the user
        alert('Player "' + opponent + '" does not exist');
    }
    else {
        // otherwise show the error
        alertError(err);
    }

    // connection failed
    hide(connectionSpinner);
    hide(turnSpinner); // just in case
    disableConnect(false);
});

connectButton.addEventListener('click', connect);
info.innerHTML = INFO_START;

/* Script to set up draw game (Use on both clients)
// need to adjust NUM_TO_WIN
// -1 for initiating user to cause draw
// -2 for opponent user to cause draw
for (var i = 0; i < BOARD_SIZE * BOARD_SIZE - 1; i++) {
    var c = i % 2 === 0 ? BLACK : WHITE;
    board.addStone(c, Math.floor(i / BOARD_SIZE), i % BOARD_SIZE) 
}
*/