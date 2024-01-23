const canvas = document.getElementById("hockeyTable");
const ctx = canvas.getContext("2d");

// Paddle properties
const paddleHeight = 200; // Increased height
const paddleWidth = 20; // Optionally increase width if needed
let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;
let leftPaddleSpeed = 500;
let rightPaddleSpeed = 500;
const friction = 0.98;

// Puck properties
const puckRadius = 10;
let puckX = canvas.width / 2;
let puckY = canvas.height / 2;
let puckSpeedX = (Math.random() > 0.5 ? 1 : -1) * 4; // Random direction
let puckSpeedY = (Math.random() > 0.5 ? 1 : -1) * 4;

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

const maxPaddleSpeed = 10;

function onKeyDown(e) {
  if (e.key == "ArrowUp") {
    rightPaddleSpeed = -5;
  } else if (e.key == "ArrowDown") {
    rightPaddleSpeed = maxPaddleSpeed;
  }

  if (e.key == "w") {
    leftPaddleSpeed = -5;
  } else if (e.key == "s") {
    leftPaddleSpeed = maxPaddleSpeed;
  }
}

function onKeyUp(e) {
  if (e.key == "ArrowUp" || e.key == "ArrowDown") {
    rightPaddleSpeed = 0;
  }

  if (e.key == "w" || e.key == "s") {
    leftPaddleSpeed = 0;
  }
}

function updatePaddlePosition() {
  leftPaddleY += leftPaddleSpeed;
  rightPaddleY += rightPaddleSpeed;

  // Apply friction
  leftPaddleSpeed *= friction;
  rightPaddleSpeed *= friction;

  // Prevent paddles from moving out of the canvas
  leftPaddleY = Math.max(
    Math.min(leftPaddleY, canvas.height - paddleHeight),
    0
  );
  rightPaddleY = Math.max(
    Math.min(rightPaddleY, canvas.height - paddleHeight),
    0
  );
}

function updatePuckPosition() {
  puckX += puckSpeedX;
  puckY += puckSpeedY;

  // Bounce off top and bottom walls
  if (puckY < puckRadius || puckY > canvas.height - puckRadius) {
    puckSpeedY = -puckSpeedY;
  }

  // Bounce off paddles
  if (
    (puckX < paddleWidth + puckRadius &&
      puckY > leftPaddleY &&
      puckY < leftPaddleY + paddleHeight) ||
    (puckX > canvas.width - paddleWidth - puckRadius &&
      puckY > rightPaddleY &&
      puckY < rightPaddleY + paddleHeight)
  ) {
    puckSpeedX = -puckSpeedX;
  }

  // Check for scoring
  if (puckX < 0 || puckX > canvas.width) {
    // Reset puck position for next round
    puckX = canvas.width / 2;
    puckY = canvas.height / 2;
    puckSpeedX = (Math.random() > 0.5 ? 1 : -1) * 4;
    puckSpeedY = (Math.random() > 0.5 ? 1 : -1) * 4;
  }
}

function drawPaddle() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
  ctx.fillRect(
    canvas.width - paddleWidth,
    rightPaddleY,
    paddleWidth,
    paddleHeight
  );
}

function drawPuck() {
  ctx.beginPath();
  ctx.arc(puckX, puckY, puckRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePaddlePosition();
  updatePuckPosition();
  drawPaddle();
  drawPuck();
  requestAnimationFrame(gameLoop);
}

gameLoop();
