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
const FPS = 120; // High FPS for fast snake movement

let snakePos = [WIDTH / 2, HEIGHT / 2];
let snakeBody = [[WIDTH / 2, HEIGHT / 2]];
let direction = 'RIGHT';
let changeTo = direction;
let score = 0;
let gameOver = false;
let lastUpdateTime = performance.now();

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

function draw() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw snake (blue) with "D.O.G.E" in black on head
    ctx.fillStyle = 'blue';
    for (let i = 0; i < snakeBody.length; i++) {
        const [x, y] = snakeBody[i];
        ctx.fillRect(x, y, FOOD_SIZE, FOOD_SIZE);
        if (i === 0) {
            ctx.fillStyle = 'black';
            ctx.font = '10px Arial';
            ctx.fillText('D.O.G.E', x + 1, y + 9);
            ctx.fillStyle = 'blue'; // Reset fill style for body
        }
    }

    // Draw foods (black circles)
    ctx.fillStyle = 'black';
    foods.forEach(food => {
        ctx.beginPath();
        ctx.arc(food.pos[0] + FOOD_SIZE / 2, food.pos[1] + FOOD_SIZE / 2, FOOD_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(food.name, food.pos[0], food.pos[1] + FOOD_SIZE + 5);
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

function update(currentTime) {
    if (gameOver) return;

    if (currentTime - lastUpdateTime < 1000 / FPS) {
        requestAnimationFrame(gameLoop);
        return;
    }
    lastUpdateTime = currentTime;

    direction = changeTo;

    if (direction === 'UP') snakePos[1] -= FOOD_SIZE;
    if (direction === 'DOWN') snakePos[1] += FOOD_SIZE;
    if (direction === 'LEFT') snakePos[0] -= FOOD_SIZE;
    if (direction === 'RIGHT') snakePos[0] += FOOD_SIZE;

    snakeBody.unshift([snakePos[0], snakePos[1]]);

    let foodEaten = null;
    for (let i = 0; i < foods.length; i++) {
        if (snakePos[0] === foods[i].pos[0] && snakePos[1] === foods[i].pos[1]) {
            foodEaten = { ...foods[i], index: i };
            score += foodEaten.type === 'Team Member' ? TEAM_MEMBER_POINTS : AGENCY_POINTS;
            if (foodEaten.type === 'Team Member') {
                collectedTeamMembers.add(foodEaten.name);
            } else {
                collectedAgencies.add(foodEaten.name);
            }
        }
    }

    if (foodEaten) {
        foods.splice(foodEaten.index, 1);
        const newFoodType = foodEaten.type === 'Team Member' ? 'Team Member' : 'Agency';
        const newFoodName = randomChoice(newFoodType === 'Team Member' ? teamMembers : agencies);
        const newPos = getNonOverlappingPos(foods);
        foods.push({ type: newFoodType, name: newFoodName, pos: newPos });
    } else {
        snakeBody.pop();
    }

    if (snakePos[0] < 0 || snakePos[0] >= WIDTH || snakePos[1] < 0 || snakePos[1] >= HEIGHT) {
        gameOver = true;
    }
}

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
    lastUpdateTime = performance.now();
    gameLoop();
}

function gameLoop(timestamp) {
    draw();
    if (!gameOver) {
        update(timestamp);
    }
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
