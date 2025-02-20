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
let snakeSpeed = 5; // Slower for web, adjust as needed
let direction = 'RIGHT';
let changeTo = direction;
let score = 0;
let gameOver = false;

const teamMembers = ["Elon Musk", "Donald Trump", "Vivek Ramaswamy", "Russell Vought", "Joni Ernst"];
const agencies = ["USAID", "CFPB", "Dept. of Education", "FAA", "IRS"];

let foodType = randomChoice(["Team Member", "Agency"]);
let foodName = randomChoice(teamMembers if foodType === "Team Member" else agencies);
let foodPos = [randomRange(1, WIDTH / FOOD_SIZE) * FOOD_SIZE, randomRange(1, HEIGHT / FOOD_SIZE) * FOOD_SIZE];
let foodSpawn = true;

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'DOWN') changeTo = 'UP';
            break;
        case 'ArrowDown':
            if (direction !== 'UP') changeTo = 'DOWN';
            break;
        case 'ArrowLeft':
            if (direction !== 'RIGHT') changeTo = 'LEFT';
            break;
        case 'ArrowRight':
            if (direction !== 'LEFT') changeTo = 'RIGHT';
            break;
    }
});

// Game loop
function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText(`Game Over! Final Score: ${score}  Length: ${snakeBody.length}`, WIDTH / 2 - 150, HEIGHT / 2);
        return;
    }

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
        foodName = randomChoice(teamMembers if foodType === "Team Member" else agencies);
        foodPos = [randomRange(1, WIDTH / FOOD_SIZE) * FOOD_SIZE, randomRange(1, HEIGHT / FOOD_SIZE) * FOOD_SIZE];
        foodSpawn = true;
    }

    // Draw
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw snake
    ctx.fillStyle = 'black';
    for (let pos of snakeBody) {
        ctx.fillRect(pos[0], pos[1], FOOD_SIZE, FOOD_SIZE);
    }

    // Draw food
    ctx.beginPath();
    ctx.arc(foodPos[0] + FOOD_SIZE / 2, foodPos[1] + FOOD_SIZE / 2, FOOD_SIZE / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(foodName, foodPos[0], foodPos[1] + FOOD_SIZE + 15);

    // Draw score
    scoreDisplay.textContent = `Score: ${score}  Length: ${snakeBody.length}`;

    // Check borders (kill zones)
    if (snakePos[0] < 0 || snakePos[0] >= WIDTH || snakePos[1] < 0 || snakePos[1] >= HEIGHT) {
        gameOver = true;
    }

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
