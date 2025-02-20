const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartText = document.getElementById('restartText');
const rulesText = document.getElementById('rulesText');

const gridSize = 20;
const tileCountX = canvas.width / gridSize;  // 800 / 20 = 40 tiles wide
const tileCountY = canvas.height / gridSize; // 500 / 20 = 25 tiles tall

let snake = [
    { x: 20, y: 12 }, // Start snake more centrally in wider space
];
let foods = [
    {
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY),
        type: Math.random() < 0.5 ? 'audit' : 'team'
    },
    {
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY),
        type: Math.random() < 0.5 ? 'audit' : 'team'
    },
    {
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY),
        type: Math.random() < 0.5 ? 'audit' : 'team'
    }
];
let democrats = []; // Array to store Democrat blocks
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 100;
let gameActive = true;

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const SPACE_KEY = 32;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === SPACE_KEY && !gameActive) {
        restartGame();
        return;
    }

    if (!gameActive) return;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function drawGame() {
    if (!gameActive) return;

    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check if snake ate any food
    let foodEaten = false;
    for (let i = 0; i < foods.length; i++) {
        if (head.x === foods[i].x && head.y === foods[i].y) {
            if (foods[i].type === 'audit') {
                score += 30; // Higher score for Audits
                // Increase snake size by 3 for Audits
                for (let j = 0; j < 3; j++) {
                    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
                }
            } else if (foods[i].type === 'team') {
                score += 10; // Lower score for Team Members
                // Increase snake size by 1 for Team Members
                snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
            }
            // Remove the eaten food and add a new one
            foods.splice(i, 1);
            foods.push({
                x: Math.floor(Math.random() * tileCountX),
                y: Math.floor(Math.random() * tileCountY),
                type: Math.random() < 0.5 ? 'audit' : 'team'
            });
            // Add a Democrat block after eating food
            addDemocrat();
            foodEaten = true;
            break;
        }
    }

    if (!foodEaten) {
        snake.pop();
    }

    // Check collision with walls
    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        gameOver();
        return;
    }

    // Check collision with self
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    // Check collision with Democrats
    for (let i = 0; i < democrats.length; i++) {
        if (head.x === democrats[i].x && head.y === democrats[i].y) {
            gameOver();
            return;
        }
    }

    // Draw everything
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Draw foods based on type
    foods.forEach(food => {
        if (food.type === 'audit') {
            ctx.fillStyle = 'red';
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
        } else if (food.type === 'team') {
            ctx.fillStyle = 'green'; // Changed from blue to green for Team Members
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
        }
    });

    // Draw Democrats (red blocks)
    ctx.fillStyle = 'red';
    democrats.forEach(democrat => {
        ctx.fillRect(democrat.x * gridSize, democrat.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Draw "D.O.G.E" above the snake's head
    ctx.fillStyle = 'white';
    ctx.font = '15px Arial';
    const nameWidth = ctx.measureText('D.O.G.E').width;
    const nameX = snake[0].x * gridSize + (gridSize - nameWidth) / 2; // Center the name above the head
    const nameY = snake[0].y * gridSize - 5; // Position above the head with a small offset
    ctx.fillText('D.O.G.E', nameX, nameY);

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    setTimeout(drawGame, gameSpeed);
}

function gameOver() {
    gameActive = false;
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    const gameOverWidth = ctx.measureText('Game Over!').width;
    const scoreWidth = ctx.measureText(`Score: ${score}`).width;
    ctx.fillText('Game Over!', (canvas.width - gameOverWidth) / 2, canvas.height / 2 - 20); // Center horizontally and vertically
    ctx.fillText(`Score: ${score}`, (canvas.width - scoreWidth) / 2, canvas.height / 2 + 20); // Center horizontally, below Game Over
    restartText.style.display = 'block'; // Show restart text
}

function restartGame() {
    snake = [{ x: 20, y: 12 }];
    foods = [
        {
            x: Math.floor(Math.random() * tileCountX),
            y: Math.floor(Math.random() * tileCountY),
            type: Math.random() < 0.5 ? 'audit' : 'team'
        },
        {
            x: Math.floor(Math.random() * tileCountX),
            y: Math.floor(Math.random() * tileCountY),
            type: Math.random() < 0.5 ? 'audit' : 'team'
        },
        {
            x: Math.floor(Math.random() * tileCountX),
            y: Math.floor(Math.random() * tileCountY),
            type: Math.random() < 0.5 ? 'audit' : 'team'
        }
    ];
    democrats = []; // Clear Democrats on restart
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 100;
    gameActive = true;
    restartText.style.display = 'none'; // Hide restart text
    drawGame();
}

function addDemocrat() {
    let newDemocrat;
    do {
        newDemocrat = {
            x: Math.floor(Math.random() * tileCountX),
            y: Math.floor(Math.random() * tileCountY)
        };
        // Ensure the new Democrat doesn't overlap with the snake or existing foods/democrats
    } while (snake.some(segment => segment.x === newDemocrat.x && segment.y === newDemocrat.y) ||
             foods.some(food => food.x === newDemocrat.x && food.y === newDemocrat.y) ||
             democrats.some(dem => dem.x === newDemocrat.x && dem.y === newDemocrat.y));
    democrats.push(newDemocrat);
}

drawGame();
