var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 6;
var ballSpeedY = 4;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false; 

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}


function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = true;
    }

    ballSpeedX = - ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function computerMovement() {
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);

    if (paddle2YCenter < ballY - 35) {
        paddle2Y += 6;
    } else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= 6;
    }
}


function moveEverything() {
    if (showingWinScreen) {
        return;
    }

    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    //reset the ball - left side
    if (ballX < 0) {
        if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = - ballSpeedX;
            
            var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        }
            else {
                player2Score++; // adding to the score before reseting the ball
                ballReset();
        }
        }

    //reset the ball - right side
    if (ballX > canvas.width) {
        if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
        ballSpeedX = - ballSpeedX;

        var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
        ballSpeedY = deltaY * 0.35;
    }
    else {
        player1Score++;
        ballReset();
        }
}

    if (ballY < 0) {
        ballSpeedY = - ballSpeedY;
    }
    if (ballY > canvas.height) {
        ballSpeedY = - ballSpeedY;
    }
    

}

function drawEverything() {
    //black screen
    colorRect(0,0,canvas.width,canvas.height, 'black');
    
    if (showingWinScreen) {
        canvasContext.fillStyle = 'white';
        canvasContext.fillText("Click to continue", 100, 100);
        return;
    }

    // left player paddle
    colorRect(0,paddle1Y,PADDLE_THICKNESS, PADDLE_HEIGHT, 'blue');

    //right paddle
    colorRect(canvas.width - PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    
    //the ball
    colorCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText("Player 1 Score", 70, 80);
    canvasContext.fillText("Player 2 Score", canvas.width - 130, 80);
    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function colorRect(leftX,topY, width, height, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

 // Function to start the game
 function startGame() {

    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    canvas.style.display = 'block';
    
    var framesPerSecond = 30;
    setInterval(	function() {
                moveEverything();
                drawEverything();
                },1000/framesPerSecond);

    canvas.addEventListener('mousemove', 
                function(evt) {
                    var mousePos = calculateMousePos(evt);
                    paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
                }
    );
}


// Event listener for the Play button
document.getElementById('playButton').addEventListener('click', function() {
    startGame();  // Call the function to start the game
    this.style.display = 'none';  // Hide the Play button
});

