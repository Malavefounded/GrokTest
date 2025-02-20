const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartText = document.getElementById('restartText');

const gridSize = 20;
const tileCountX = canvas.width / gridSize;  // 800 / 20 = 40 tiles wide
const tileCountY = canvas.height / gridSize; // 500 / 20 = 25 tiles tall

let snake = [
    { x: 20, y: 12 }, // Start snake more centrally in wider space
];
let food = {
    x: Math.floor(Math.random() * tileCountX),
    y: Math.floor(Math.random() * tileCountY),
    type: Math.random() < 0.5 ? 'audit' : 'team' // Randomly choose food type
};
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

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        if (food.type === 'audit') {
            score += 30; // Higher score for audits
            // Increase snake size by 3 for audits
            for (let i = 0; i < 3; i++) {
                snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
            }
        } else if (food.type === 'team') {
            score += 10; // Lower score for team members
            // Increase snake size by 1 for team members
            snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
        }
        gameSpeed = Math.max(50, gameSpeed - 2); // Increase speed slightly
        // Generate new food with random type
        food = {
            x: Math.floor(Math.random() * tileCountX),
            y: Math.floor(Math.random() * tileCountY),
            type: Math.random() < 0.5 ? 'audit' : 'team'
        };
    } else {
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

    // Draw everything
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Draw food based on type
    if (food.type === 'audit') {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    } else if (food.type === 'team') {
        ctx.fillStyle = 'blue';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }

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
    ctx.fillText('Game Over!', canvas.width/4, canvas.height/2);
    ctx.fillText(`Score: ${score}`, canvas.width/3.5, canvas.height/2 + 40);
    restartText.style.display = 'block'; // Show restart text
}

function restartGame() {
    snake = [{ x: 20, y: 12 }];
    food = {
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY),
        type: Math.random() < 0.5 ? 'audit' : 'team'
    };
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 100;
    gameActive = true;
    restartText.style.display = 'none'; // Hide restart text
    drawGame();
}

drawGame();
