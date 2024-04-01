/* Board */

let board;
let boardWidth = 360;
let boardHeight = 620;
let context;

/* Bird */
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

/* pipes */
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

/* game physics */
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

/*highscore*/
let highScore = 0;

/*drawing the board */
window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  birdImg = new Image();
  birdImg.src = "images/flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "images/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "images/bottompipe.png";

  requestAnimationFrame(update);

  //places pipes every 1.5 seconds
  setInterval(placePipes, 1500);
  document.addEventListener("keydown", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  //bird
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }
  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  //clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    //remove first element from array
    pipeArray.shift();
  }
  //Score
  context.fillStyle = "white";
  context.font = "25px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillText("High Score: " + getHighScore(), 5, 85);
    context.fillText("GAME OVER", 5, 120);
    context.fillText("Press up Arrow to play Again", 5, 180);
  }

  if (score > highScore) {
    highScore = score;
    saveHighScore();
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(bottomPipe);
}

function moveBird(event) {
  if (event.code == "Space" || event.code == "ArrowUp") {
    velocityY = -6;

    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
    }
  }
}

//playing the game by clicking
window.addEventListener("click", function () {
  velocityY = -6;

  if (gameOver) {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
  }
});

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

//Highscore
// Function to save the high score
function saveHighScore(score) {
  // Check if the user's browser supports localStorage
  if (typeof Storage !== "undefined") {
    // Use localStorage to store the high score
    localStorage.setItem("highScore", score);
  } else {
    // If the browser doesn't support localStorage, handle the error accordingly
    console.log("Sorry, your browser does not support local storage.");
  }
}

// Function to retrieve the high score
function saveHighScore() {
  if (typeof Storage !== "undefined") {
    localStorage.setItem("highScore", highScore);
  }
}

function getHighScore() {
  if (typeof Storage !== "undefined") {
    const storedHighScore = localStorage.getItem("highScore");
    if (storedHighScore !== null) {
      return parseInt(storedHighScore);
    }
  }
  return 0; // Default value if high score is not found
}
