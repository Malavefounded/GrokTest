const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let snake = [
    { x: canvas.width / 2, y: canvas.height / 2 }
];
let dx = 0; // Start stationary, controlled by keys
let dy = 0;
let foods = []; // Array to hold 2-3 programs
let score = 0;
let gameSpeed = 100; // milliseconds between moves

// Government programs Elon Musk is currently looking into (as of Feb 19, 2025, based on public statements)
const governmentPrograms = [
    "USPS", "EPA Regulations", "NASA Funding", "DHS Grants", "DOE Projects", "NOAA Research", "FEMA Aid", "HUD Programs", "Medicaid Expansion", "SNAP Benefits"
];

function initFoods() {
    while (foods.length < 3) {
        let newFood = {
            x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
            y: Math.floor(Math.random() * (canvas.height / 20)) * 20,
            program: governmentPrograms[Math.floor(Math.random() * governmentPrograms.length)]
        };
        // Ensure food doesn’t spawn on snake or overlap other food
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) &&
            !foods.some(food => food.x === newFood.x && food.y === newFood.y)) {
            foods.push(newFood);
        }
    }
}

function drawSnake() {
    ctx.fillStyle = 'green'; // Snake body color
    ctx.font = '16px Arial'; // Font for "D.O.G.E" text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    snake.forEach((segment, index) => {
        // Draw thick snake segment (20x20 pixels)
        ctx.fillRect(segment.x, segment.y, 20, 20);

        // Draw "D.O.G.E" text on the snake
        let text = "D.O.G.E";
        if (index % 4 === 0) { // Repeat "D.O.G.E" every 4 segments for visibility
            ctx.fillStyle = 'white';
            ctx.fillText(text, segment.x + 10, segment.y + 10);
            ctx.fillStyle = 'green'; // Reset color for next segment
        }
    });
}

function drawFoods() {
    ctx.fillStyle = 'red';
    ctx.font = '16px Arial';
    foods.forEach(food => {
        ctx.fillText(food.program, food.x + 10, food.y + 10);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check collision with walls (no wrapping)
    if (head.x < 0 || head.x >= canvas.width - 20 || head.y < 0 || head.y >= canvas.height - 20) {
        gameOver();
        return;
    }

    // Check collision with self
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Check if snake ate any food
    let foodEaten = false;
    foods = foods.filter(food => {
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
            foodEaten = true;
            return false; // Remove eaten food
        }
        return true; // Keep uneaten food
    });

    if (foodEaten) {
        initFoods(); // Add new food to maintain 3 programs
    } else {
        snake.pop(); // Remove tail if no food eaten
    }
}

function gameOver() {
    alert(`Game Over! Score: ${score}`);
    snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    foods = [];
    initFoods();
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSnake();
    drawFoods();
    moveSnake();
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -20; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = 20; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -20; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = 20; dy = 0; }
            break;
    }
});

initFoods();
setInterval(draw, gameSpeed);

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    snake = [{ x: canvas.width / 2, y: canvas.height / 2 }]; // Reset snake position
    dx = 0;
    dy = 0;
    foods = [];
    initFoods();
});
