
// Initialize the canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const auditedPanel = document.getElementById('auditedPanel');
const teamMembersPanel = document.getElementById('teamMembersPanel');

// Game settings
const WIDTH = 800;
const HEIGHT = 600;
const FOOD_SIZE = 10;
const TEAM_MEMBER_POINTS = 5;
const AGENCY_POINTS = 10;
const FPS = 15; // Fixed frames per second to control speed

let snakePos = [WIDTH / 2, HEIGHT / 2];
let snakeBody = [[WIDTH / 2, HEIGHT / 2]];
let direction = 'RIGHT';
let changeTo = direction;
let score = 0;
let gameOver = false;
let lastUpdateTime = performance.now(); // Initialize with performance.now() for consistent timing

const teamMembers = ["Elon Musk", "Donald Trump", "Vivek Ramaswamy", "Russell Vought", "Joni Ernst"];
const agencies = ["USAID", "CFPB", "Dept. of Education", "FAA", "IRS"];

let foods = [
    { type: "Agency", name: randomChoice(agencies), pos: generateRandomPos() },
    { type: "Agency", name: randomChoice(agencies), pos: generateRandomPos() },
    { type: "Team Member", name: randomChoice(teamMembers), pos: generateRandomPos() }
];
let collectedTeamMembers = new Set();
let collectedAgencies = new Set();

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomPos() {
    return [Math.floor(Math.random() * (WIDTH / FOOD_SIZE)) * FOOD_SIZE, 
            Math.floor(Math.random() * (HEIGHT / FOOD_SIZE)) * FOOD_SIZE];
}

// Ensure food positions don't overlap with snake or each other
function isPositionValid(pos, excludeFoods = []) {
    for (let bodyPart of snakeBody) {
        if (pos[0] === bodyPart[0] && pos[1] === bodyPart[1]) return false;
    }
    for (let food of foods) {
        if (excludeFoods.includes(food)) continue;
        if (pos[0] === food.pos[0] && pos[1] === food.pos[1]) return false;
    }
    return true;
}

function getNonOverlappingPos(excludeFoods = []) {
    let pos;
    do {
        pos = generateRandomPos();
    } while (!isPositionValid(pos, excludeFoods));
    return pos;
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

    // Draw snake (black) with "D.O.G.E" on head
    ctx.fillStyle = 'black';
    for (let i = 0; i < snakeBody.length; i++) {
        const [x, y] = snakeBody[i];
        ctx.fillRect(x, y, FOOD_SIZE, FOOD_SIZE);
        if (i === 0) { // Draw "D.O.G.E" on snake head
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.fillText('D.O.G.E', x + 2, y + 8);
            ctx.fillStyle = 'black'; // Reset fill style for body
        }
    }

    // Draw foods (black circles)
    foods.forEach(food => {
        ctx.beginPath();
        ctx.arc(food.pos[0] + FOOD_SIZE / 2, food.pos[1] + FOOD_SIZE / 2, FOOD_SIZE / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(food.name, food.pos[0], food.pos[1] + FOOD_SIZE + 15);
    });

    // Draw reset text (blue, top center)
    ctx.fillStyle = 'blue';
    ctx.font = '20px Arial';
    ctx.fillText('Press SPACE to reset', WIDTH / 2 - 110, 30);

    // Update score display
    scoreDisplay.textContent = `Score: ${score}  Length: ${snakeBody.length}`;

    // Update side panels
    auditedPanel.innerHTML = "Government Organizations Audited:<br>" + Array.from(collectedAgencies).join('<br>');
    teamMembersPanel.innerHTML = "Team Members Found:<br>" + Array.from(collectedTeamMembers).join('<br>');
}

// Update game state
function update(currentTime) {
    if (gameOver) return;

    // Frame rate control (limit to FPS)
    if (currentTime - lastUpdateTime < 1000 / FPS) {
        requestAnimationFrame(gameLoop);
        return;
    }
    lastUpdateTime = currentTime;

    // Update direction
    direction = changeTo;

    // Move snake
    if (direction === 'UP') snakePos[1] -= FOOD_SIZE;
    if (direction === 'DOWN') snakePos[1] += FOOD_SIZE;
    if (direction === 'LEFT') snakePos[0] -= FOOD_SIZE;
    if (direction === 'RIGHT') snakePos[0] += FOOD_SIZE;

    // Snake body mechanics
    snakeBody.unshift([snakePos[0], snakePos[1]]);

    // Check for food collision
    let foodEaten = null;
    foods.forEach((food, index) => {
        if (snakePos[0] === food.pos[0] && snakePos[1] === food.pos[1]) {
            foodEaten = { ...food, index };
            score += food.type === 'Team Member' ? TEAM_MEMBER_POINTS : AGENCY_POINTS;
            if (food.type === 'Team Member') {
                collectedTeamMembers.add(food.name);
            } else {
                collectedAgencies.add(food.name);
            }
        }
    });

    if (foodEaten) {
        foods.splice(foodEaten.index, 1);
        const newFoodType = foodEaten.type === 'Team Member' ? 'Team Member' : 'Agency';
        const newFoodName = randomChoice(newFoodType === 'Team Member' ? teamMembers : agencies);
        const newPos = getNonOverlappingPos(foods);
        foods.push({ type: newFoodType, name: newFoodName, pos: newPos });
    } else {
        snakeBody.pop();
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
    collectedTeamMembers.clear();
    collectedAgencies.clear();
    foods = [
        { type: "Agency", name: randomChoice(agencies), pos: getNonOverlappingPos() },
        { type: "Agency", name: randomChoice(agencies), pos: getNonOverlappingPos([foods[0]]) },
        { type: "Team Member", name: randomChoice(teamMembers), pos: getNonOverlappingPos(foods) }
    ];
    lastUpdateTime = performance.now(); // Reset last update time using performance.now() for consistent timing
    gameLoop();
}

// Game loop
function gameLoop(timestamp) {
    draw();
    if (!gameOver) {
        update(timestamp);
    }
    requestAnimationFrame(gameLoop);
}

// Start the game
requestAnimationFrame(gameLoop);
