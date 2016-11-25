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
        // check if the space is open
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
var BLACK = -1; // plays first

// info strings
var INFO_START = 'Enter a player\'s ID and click "Connect" to play Gomoku with them.';
var INFO_TURN = 'Click an empty square to place a stone.';
var INFO_WAIT = 'Wait for the other player to place a stone.';
var INFO_WON = ' won the game.';

// html elements
var canvas = document.getElementById('canvas'); // canvas to be render to
var myId = document.getElementById('my_id'); // element that displays the user's id
var opponentId = document.getElementById('opponent_id'); // element containing the opponent's id
var connectButton = document.getElementById('connect_button'); // button the user clicks to start a game
var connectionSpinner = document.getElementById('connection_spinner'); // spinner for waiting to connect
var infoDisplay = document.getElementById('info'); // where info is displayed to the user
var turnSpinner = document.getElementById('turn_spinner'); // spinner for waiting for opponent turn 

// globals
var boardSize = 19;
var ctx = canvas.getContext('2d'); // canvas context
var me = new Peer({ key: 'djdn2sprx3kdquxr' }); // user's peer connection
var connection = null; // connection to the other player
var myTurn = false; // who's turn is it?
var color = null; // user's stone color
var opponent = null; // id of the opponent player
var cellSize = canvas.width / boardSize; // size of a board square
var board = new Board(); // the game board

function connect() {
    // attempt to connect if the user has entered an opponent id
    opponent = opponentId.value;

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
        if (board.placeStone(color * -1, row, col)) {
            // the other player won
            info.innerHTML = 'Player "' + opponent + '"' + INFO_WON;
            connection.close();
        }
        else {
            // set to the user's turn
            info.innerHTML = INFO_TURN + ' Last stone placed at (' + row + ',' + col + ').';
            myTurn = true;
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
            if (board.placeStone(color, row, col)) {
                // the user won
                info.innerHTML = 'You' + INFO_WON;
            }
            else {
                // inform the user that we are waiting on their opponent
                show(turnSpinner);
                infor.innerHTML = INFO_WAIT;
            }

            myTurn = false;
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
        // if not connected disable connection elements
        disableConnect(true);

        // set up connection initiated by other player
        connection = conn;
        color = WHITE;
        setupConnection(connection);
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
