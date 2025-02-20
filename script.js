// Initialize the canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// Game settings
const WIDTH = 800;
const HEIGHT = 600;
const FOOD_SIZE = 10;
const TEAM_MEMBER_POINTS = 5;
const AGENCY_POINTS = 10;

let snakePos = [WIDTH / 2, HEIGHT / 2];
let snakeBody = [[WIDTH / 2, HEIGHT / 2]];
let snakeSpeed = 5; // Adjust for speed
let direction = 'RIGHT';
let changeTo = direction;
let score = 0;
let gameOver = false;

const teamMembers = ["Elon Musk", "Donald Trump", "Vivek Ramaswamy", "Russell Vought", "Joni Ernst"];
const agencies = ["USAID", "CFPB", "Dept. of Education", "FAA", "IRS"];

let foodType = randomChoice(["Team Member", "Agency"]);
let foodName = randomChoice(foodType === "Team Member" ? teamMembers : agencies);
let foodPos = [Math.floor(Math.random() * (WIDTH / FOOD_SIZE)) * FOOD_SIZE, 
               Math.floor(Math.random() * (HEIGHT / FOOD_SIZE)) * FOOD_SIZE];
let foodSpawn = true;

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'DOWN' && !gameOver) changeTo = 'UP';
            break;
        case 'ArrowDown':
            if (direction !== 'UP' && !gameOver) changeTo = 'DOWN';
            break;
        case 'ArrowLeft':
            if (direction !== 'RIGHT' && !gameOver) changeTo = 'LEFT';
            break;
        case 'ArrowRight':
            if (direction !== 'LEFT' && !gameOver) changeTo = 'RIGHT';
            break;
        case ' ':
            if (gameOver) resetGame();
            break;
    }
});

// Draw game elements
function draw() {
    // Clear canvas with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw snake (black)
    ctx.fillStyle = 'black';
    for (let pos of snakeBody) {
        ctx.fillRect(pos[0], pos[1], FOOD_SIZE, FOOD_SIZE);
    }

    // Draw food (black circle)
    ctx.beginPath();
    ctx.arc(foodPos[0] + FOOD_SIZE / 2, foodPos[1] + FOOD_SIZE / 2, FOOD_SIZE / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();

    // Draw food name below circle
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(foodName, foodPos[0], foodPos[1] + FOOD_SIZE + 15);

    // Draw reset text (blue, top center)
    ctx.fillStyle = 'blue';
    ctx.font = '20px Arial';
    ctx.fillText('Press SPACE to reset', WIDTH / 2 - 110, 30);

    // Update score display
    scoreDisplay.textContent = `Score: ${score}  Length: ${snakeBody.length}`;
}

// Update game state
function update() {
    if (gameOver) return;

    // Update direction
    direction = changeTo;

    // Move snake
    if (direction === 'UP') snakePos[1] -= FOOD_SIZE;
    if (direction === 'DOWN') snakePos[1] += FOOD_SIZE;
    if (direction === 'LEFT') snakePos[0] -= FOOD_SIZE;
    if (direction === 'RIGHT') snakePos[0] += FOOD_SIZE;

    // Snake body mechanics
    snakeBody.unshift([snakePos[0], snakePos[1]]);
    if (snakePos[0] === foodPos[0] && snakePos[1] === foodPos[1]) {
        score += foodType === 'Team Member' ? TEAM_MEMBER_POINTS : AGENCY_POINTS;
        foodSpawn = false;
    } else {
        snakeBody.pop();
    }

    // Spawn new food
    if (!foodSpawn) {
        foodType = randomChoice(["Team Member", "Agency"]);
        foodName = randomChoice(foodType === "Team Member" ? teamMembers : agencies);
        foodPos = [Math.floor(Math.random() * (WIDTH / FOOD_SIZE)) * FOOD_SIZE, 
                   Math.floor(Math.random() * (HEIGHT / FOOD_SIZE)) * FOOD_SIZE];
        foodSpawn = true;
    }

    // Check borders (kill zones)
    if (snakePos[0] < 0 || snakePos[0] >= WIDTH || snakePos[1] < 0 || snakePos[1] >= HEIGHT) {
        gameOver = true;
    }
}

// Reset game
function resetGame() {
    snakePos = [WIDTH / 2, HEIGHT / 2];
    snakeBody = [[WIDTH / 2, HEIGHT / 2]];
    direction = 'RIGHT';
    changeTo = direction;
    score = 0;
    gameOver = false;
    foodType = randomChoice(["Team Member", "Agency"]);
    foodName = randomChoice(foodType === "Team Member" ? teamMembers : agencies);
    foodPos = [Math.floor(Math.random() * (WIDTH / FOOD_SIZE)) * FOOD_SIZE, 
               Math.floor(Math.random() * (HEIGHT / FOOD_SIZE)) * FOOD_SIZE];
    foodSpawn = true;
    gameLoop();
}

// Game loop
function gameLoop() {
    draw();
    if (!gameOver) {
        update();
    }
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
