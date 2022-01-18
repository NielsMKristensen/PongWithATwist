
//get canvas
let canvas = document.getElementById('gameArea')
let ctx = canvas.getContext("2d")
//ball start position
let x = canvas.width/2;
let y = canvas.height-30;
//Direction
let dx = 1;
let dy = -1;
//ball move speed
let speed = 10;
//ball emoji select and size
let ballEmo = '🥵'
let emojiArray = ['😃','😂','😍','😆','🥰','🤢', '🥵'];
let ballRadius = 20; //when using emoji ths is kind of guessing game. would be easier with Arc, might rewrite code to use arc and pictures.
//Paddle size and start position and color and move
let paddleHeight = 10;
let paddleWidth = 75;
let paddleStart = (canvas.width-paddleWidth) / 2;
let paddleColor = 'black'
let right = false;
let left = false;
//Score
let score = 0
//lives
let lives = 3;

//load Sounds
const hitWallSnd = new Audio('./js/mixkit-explainer-video-game-alert-sweep-236.wav');








//what button have been pressed
document.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
      case 37: // left arrow
        left = true;
        break;
      case 39: // right arrow
        right = true;
        break;
    }
  });

  document.addEventListener('keyup', (e) => {
    right = false;
    left = false;
  });
  

// drawing the Ball
function ball() {
    ctx.beginPath();
    // white ball using arc
    //ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    //ctx.fillStyle = "white";
    //ctx.fill();
    //ctx.closePath();
    //white ball using arc

    //Emoji fun :-)
    ctx.font = '2em serif'
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle'
    ctx.fillText(ballEmo, x, y)
    //Emoji fun :-)
    
}

// drawing the paddle
function paddle() {
    ctx.beginPath();
    ctx.rect(paddleStart, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}

//Display the score on screen
function displayScore(){
    let htmlScore = document.querySelector('.score input')
    htmlScore.setAttribute('value', score)
}

function displayLives(){
    let htmlLives = document.querySelector('.lives input')
    htmlLives.setAttribute('value', lives)
}

//changes background color every 10 points
function backGroundColor(){
    if(score % 5 === 0){
        let randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
        let backGround = document.querySelector('canvas')
        backGround.style.backgroundColor = randomColor;
        
    }
}

//increase speed of ball every 10 points
function speedUp(){
    if(score % 5 === 0){
        newSpeed = speed - 0.5
        speed = Math.round(newSpeed * 10) / 10
        clearInterval(interval)
        interval = setInterval(move, speed)
    }
}

//Changes the emoji of the ball every 5 points
function changeBall(){
    if(score % 1 === 0){
        let emoIndex = Math.floor(Math.random() * 7)
        ballEmo = emojiArray[emoIndex]
    }

}

//main function moves/adds the ball and paddle to the canvas and manages borders.
function move() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball();
    paddle();
    displayLives();

    //change direction and bounce off the edges of the canvas (left and right)
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
        score = score + 1
        displayScore();
        backGroundColor();
        speedUp();
        changeBall();
        // play sound when hitting side borders
        hitWallSnd.play();
        }
    
    //change direction and bounce off the edges of the canvas (top)
    if(y + dy < ballRadius) {
        dy = -dy;
        score = score + 1
        displayScore();
        backGroundColor();
        speedUp();
        changeBall();
        // play sound when hitting top border
        hitWallSnd.play();
    // check if ball runs out and manage lives.
    } else if(y + dy > canvas.height-(ballRadius)) {
        if(x > paddleStart && x < paddleStart + paddleWidth) {
            dy = -dy;
            // play sound when hitting paddle
            hitWallSnd.play();
        }
        else {
            lives--;
            if(!lives) {
                displayLives();
                const gameOverSnd = new Audio('./js/sfx-defeat1.mp3');
                gameOverSnd.play();
                //load canvas image
                let gameOverImg = new Image();   // Create new img element
                gameOverImg.src = './js/gameOver.jpg'; // Set source path
                gameOverImg.onload = function(){
                    ctx.drawImage(gameOverImg, 0, 0, canvas.width, canvas.height);
                };
                let buttonContent = document.querySelector('button')
                buttonContent.innerHTML = 'Continue';
                //alert("GAME OVER");
                //document.location.reload();
                clearInterval(interval);
                
                
            }
            else {
                const ballOut = new Audio('./js/ballOut.mp3');
                ballOut.play();
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 1;
                dy = -1;
                paddleStart = (canvas.width-paddleWidth)/2;  
            }
    }
    }
   
    //move paddle
    if(right) {
        paddleStart += 7;
        if (paddleStart + paddleWidth > canvas.width){
            paddleStart = canvas.width - paddleWidth;
        }
    }
    else if(left) {
        paddleStart -= 7;
        if (paddleStart < 0){
            paddleStart = 0;
        }
    }
    
    //moves the ball
    x += dx;
    y += dy;
    
}

//Start game button
let start = document.getElementById('start');
let interval = '';
start.onclick = function() {
    if (lives === 0){
        document.location.reload();
        
    } else {
        interval = setInterval(move, speed);
    }
    
    
}





    



