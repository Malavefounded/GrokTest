const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let snake = [
    { x: canvas.width / 2, y: canvas.height / 2 }
];
let dx = 20; // Snake movement speed (pixels)
let dy = 0;
let food = {};
let score = 0;
let gameSpeed = 100; // milliseconds between moves

// Government programs as food (examples of programs being shut down)
const governmentPrograms = [
    "SNAP", "HUD", "EPA Grants", "Medicaid Expansion", "DOE Loans"
];

function initFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
        y: Math.floor(Math.random() * (canvas.height / 20)) * 20,
        program: governmentPrograms[Math.floor(Math.random() * governmentPrograms.length)]
    };
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

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.font = '16px Arial';
    ctx.fillText(food.program, food.x + 10, food.y + 10);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wrap around the screen (no walls)
    if (head.x < 0) head.x = canvas.width - 20;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - 20;
    if (head.y >= canvas.height) head.y = 0;

    // Check collision with self
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Check if snake ate the food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        initFood();
    } else {
        snake.pop();
    }
}

function gameOver() {
    alert(`Game Over! Score: ${score}`);
    snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
    dx = 20;
    dy = 0;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    initFood();
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSnake();
    drawFood();
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

initFood();
setInterval(draw, gameSpeed);
