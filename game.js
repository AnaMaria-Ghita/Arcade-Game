var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 5;
var ballSpeedY = 2;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false; 

var hitSound = new Audio('ball.mp4');
var music = new Audio('music.mp3');
/*
Extreme Sport Trap Music | PISTA by Alex-Productions | https://onsound.eu/
Music promoted by https://www.chosic.com/free-music/all/
Creative Commons CC BY 3.0
https://creativecommons.org/licenses/by/3.0/
*/


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

function handleMouseClick(evt) {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
    }

    //stop the speed temporarly
    ballSpeedX = 0;
    ballSpeedY = 0;

    //pozition the ball in the center of the canvas
    ballX = canvas.width/2;
    ballY = canvas.height/2;

    // Restart the ball's movement after one sec
    setTimeout(function() {
        // Randomize the ball's direction
        ballSpeedX = (Math.random() < 0.5 ? -5 : 5);  // left or right
        ballSpeedY = (Math.random() < 0.5 ? -2 : 2);  // up or down
        }, 1000);
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
            hitSound.play();

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
        hitSound.play();
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

function drawNet(){
    for (var i=0; i<canvas.height; i+=40){
        colorRect (canvas.width/2-1, i, 2, 20, 'white');
    }
}

// Event listener for the "Play Again" button
document.getElementById('playAgain').addEventListener('click', function() {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;

    this.style.display = 'none';  // Hide "Play Again" button
});

function drawEverything() {

    colorRect(0,0,canvas.width,canvas.height, 'black');


    if (showingWinScreen) {
        canvasContext.fillStyle = 'white';

        canvasContext.font = 'bold 30px Poppins';
        canvasContext.fillStyle = 'blue';
        canvasContext.textAlign = 'center';

        if (player1Score >= WINNING_SCORE) {
            canvasContext.fillText("You Won!",canvas.width/2, 200);
        } else if (player2Score >= WINNING_SCORE) {
            canvasContext.fillText("Right Player Won!",canvas.width/2, 200);
        } 
       
        const playAgainButton = document.querySelector(".playAgain");
        if (playAgainButton) {
            playAgainButton.style.display = "block";
        }
        return;
    }

    canvasContext.textAlign = 'left';
    canvasContext.font = '16px Arial';
    canvasContext.fillStyle = 'white';

    drawNet();

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

    music.play();
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    canvas.style.display = 'block';
    
    var framesPerSecond = 25;
    setInterval(	function() {
                moveEverything();
                drawEverything();
                },1000/framesPerSecond);

    canvas.addEventListener('mousedown', handleMouseClick);            

    canvas.addEventListener('mousemove', 
                function(evt) {
                    var mousePos = calculateMousePos(evt);
                    paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
                }
    );
}

document.getElementById('playButton').addEventListener('click', function() {
    startGame();
    this.style.display = 'none';  // Hide the Play button
});

