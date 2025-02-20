// Wait for the DOM to be fully loaded before running the game
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d', { alpha: false }); // Disable alpha channel for better performance
    const restartText = document.getElementById('restartText');
    const rulesText = document.getElementById('rulesText');

    if (!canvas || !ctx || !restartText || !rulesText) {
        console.error('One or more DOM elements not found. Check your HTML.');
        return;
    }

    const gridSize = 20;
    const tileCountX = canvas.width / gridSize;  // 800 / 20 = 40 tiles wide
    const tileCountY = canvas.height / gridSize; // 500 / 20 = 25 tiles tall

    let snake = [{ x: 20, y: 12 }]; // Start snake more centrally in wider space
    let foods = [
        { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: Math.random() < 0.5 ? 'audit' : 'team' },
        { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: Math.random() < 0.5 ? 'audit' : 'team' },
        { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: Math.random() < 0.5 ? 'audit' : 'team' }
    ];
    let democrats = []; // Array to store Democrat blocks (bad - causes instant death)
    let dx = 0, dy = 0; // Combine into single line for clarity and minor performance
    let score = 0, gameSpeed = 100, gameActive = true;

    // Good food types: Audits (red, +3 size, +30 points) and Team Members (green, +1 size, +10 points)
    // Bad blocks: Democrats (blue, instant death on contact)
    const keyState = {}; // Object to track key states for smoother input handling
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    function handleKeyDown(event) {
        keyState[event.keyCode] = true;
        updateDirection();
    }

    function handleKeyUp(event) {
        keyState[event.keyCode] = false;
    }

    function updateDirection() {
        const LEFT_KEY = 37, RIGHT_KEY = 39, UP_KEY = 38, DOWN_KEY = 40, SPACE_KEY = 32;
        const goingUp = dy === -1, goingDown = dy === 1, goingRight = dx === 1, goingLeft = dx === -1;

        if (keyState[SPACE_KEY] && !gameActive) {
            restartGame();
            return;
        }

        if (!gameActive) return;

        if (keyState[LEFT_KEY] && !goingRight) { dx = -1; dy = 0; }
        else if (keyState[RIGHT_KEY] && !goingLeft) { dx = 1; dy = 0; }
        else if (keyState[UP_KEY] && !goingDown) { dx = 0; dy = -1; }
        else if (keyState[DOWN_KEY] && !goingUp) { dx = 0; dy = 1; }
    }

    // Use requestAnimationFrame for smoother, performance-optimized animation
    function gameLoop(timestamp) {
        if (!gameActive) return;

        drawGame();
        requestAnimationFrame(gameLoop);
    }

    function drawGame() {
        // Move snake
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        // Check if snake ate any good food (Audits or Team Members) - optimize with spatial partitioning if needed
        let foodEaten = false;
        for (let i = 0; i < foods.length; i++) {
            if (head.x === foods[i].x && head.y === foods[i].y) {
                // Good food consumption: Increases size and score
                if (foods[i].type === 'audit') { // Red Audits (good)
                    score += 30; // Higher score for Audits
                    for (let j = 0; j < 3; j++) {
                        snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
                    }
                } else if (foods[i].type === 'team') { // Green Team Members (good)
                    score += 10; // Lower score for Team Members
                    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
                }
                foods.splice(i, 1);
                foods.push({
                    x: Math.floor(Math.random() * tileCountX),
                    y: Math.floor(Math.random() * tileCountY),
                    type: Math.random() < 0.5 ? 'audit' : 'team'
                });
                // After eating good food, add a bad Democrat block
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

        // Check collision with self - optimize with early exit if possible
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }

        // Check collision with bad Democrats blocks
        for (let i = 0; i < democrats.length; i++) {
            if (head.x === democrats[i].x && head.y === democrats[i].y) {
                gameOver();
                return;
            }
        }

        // Draw everything - batch drawing for performance
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctxSorry about that, something didn't go as planned. Please try again, and if you're still seeing this message, go ahead and restart the app.
