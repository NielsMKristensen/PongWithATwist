
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
let ballRadius = 20; 
//paddle size and color
let paddleHeight = 15;
let paddleWidth = 75;
let paddleStart = (canvas.width-paddleWidth) / 2;
let paddleColor = 'black'
let right = false;
let left = false;
//Score
let score = 0;
//lives
let lives = 3;

//load hit wall sound
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
    ctx.font = '2em serif'
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle'
    ctx.fillText(ballEmo, x, y)
    ctx.closePath();
}

// drawing the paddle
function paddle() {
    ctx.beginPath();
    ctx.rect(paddleStart, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}

//adds fire to the bottom border.
function fire() {
    let xStart = -10
    let xDraw1 = 0
    let xDraw2 = 10
    
    for (let i = 0; i < canvas.width; i = i + 10){
        ctx.beginPath();
        ctx.moveTo(xStart,420);
        ctx.lineTo(xDraw1,410);
        ctx.lineTo(xDraw2,420);
        ctx.fillStyle = 'orange';
        ctx.fill();
        ctx.closePath();
        xStart = xStart + 10;
        xDraw1 = xDraw1 + 10;
        xDraw2 = xDraw2 + 10;
        ctx.beginPath();
        ctx.moveTo(xStart,420);
        ctx.lineTo(xDraw1,410);
        ctx.lineTo(xDraw2,420);
        ctx.fillStyle = 'orange';
        ctx.fill();
        ctx.closePath();
    }   
}

//Display the score on screen
function displayScore(){
    let htmlScore = document.querySelector('.score input')
    htmlScore.setAttribute('value', score)
}

//Display lives on screen
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
        const speedUpSnd = new Audio('./js/SpeedUp.mp3');
                speedUpSnd.play();
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
    fire();

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

//initialize canvas and lives fields
ctx.clearRect(0, 0, canvas.width, canvas.height);
ball();
paddle();
displayLives();
fire();

//Start game button
let start = document.getElementById('start');
let interval = '';
start.onclick = function() {
    if (lives === 0 || lives < 0){
        clearInterval(interval);
        document.location.reload();
        
    } else {
        clearInterval(interval);
        interval = setInterval(move, speed);
    }
    
    
}

//change color of headline on a time basis.
function changeColor(){
    let headerText = document.getElementById('header')
    let newColor = "#" + Math.floor(Math.random()*16777215).toString(16);
    headerText.style.color = newColor
}

setInterval(changeColor,100)

//buttons help and about
let help = document.getElementById('help');
help.onclick = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball();
    paddle();
    displayLives();
    fire();
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("How to play:", canvas.width/2, 50);
    ctx.font = "20px Comic Sans MS";
    ctx.textAlign = "left";
    ctx.fillText("LEFT and Right arrow key controls the paddle.", 10, 90);
    ctx.fillText("Prevent the cute Emoji from falling into the FIRE.", 10, 120);
    ctx.fillText("Warning: ball will speed up making it harder to avoid FIRE", 10, 150);
    ctx.fillText("Have FUN!", 10, 180);
   }

let about = document.getElementById('about');
about.onclick = function() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball();
    paddle();
    displayLives();
    fire();
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("About:", canvas.width/2, 50);
    ctx.font = "20px Comic Sans MS";
    ctx.fillText("Created by : Mylle", canvas.width/2, 90);
    ctx.fillText("History: First game ever created", canvas.width/2, 120);
    ctx.fillText("Copyright: The Internet", canvas.width/2, 150);
    ctx.fillText("Inspired by the Game PONG", canvas.width/2, 180);
    //image
    var pongImg = new Image();  
    
    pongImg.onload = function(){
        
        ctx.drawImage(pongImg,canvas.width/2 - 100,210);
    } 
    pongImg.src = "./js/PONG.jpg";
    
}





