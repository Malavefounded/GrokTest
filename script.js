// Canvas setup (full-screen)
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Set canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gridSize = 20; // Size of each grid cell
const tileCountX = Math.floor(canvas.width / gridSize); // Number of tiles horizontally
const tileCountY = Math.floor(canvas.height / gridSize); // Number of tiles vertically

// Snake and food properties
let snake = [
    { x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }, // Start in the center
];
let food = {
    x: Math.floor(Math.random() * tileCountX),
    y: Math.floor(Math.random() * tileCountY),
};
let dx = 0; // Horizontal velocity
let dy = 0; // Vertical velocity
let score = 0;
let speed = 7; // Frames per second for automation

// Government programs Elon Musk might cut (based on public statements, X posts, or policies)
const programs = [
    'NASA Funding', 'EPA Regulations', 'DHS Grants', 'DOE Projects', 'NOAA Research', 'FEMA Aid'
];
let currentProgram = programs[Math.floor(Math.random() * programs.length)];

// Automated movement (simple random direction changes)
function changeDirection() {
    const directions = [
        { dx: 0, dy: 1 }, // Down
        { dx: 0, dy: -1 }, // Up
        { dx: 1, dy: 0 }, // Right
        { dx: -1, dy: 0 }, // Left
    ];
    const currentDir = { dx, dy };
    let newDir;
    do {
        newDir = directions[Math.floor(Math.random() * directions.length)];
    } while (newDir.dx === -currentDir.dx && newDir.dy === -currentDir.dy); // Avoid 180-degree turns
    dx = newDir.dx;
    dy = newDir.dy;
}

// Game loop
function gameLoop() {
    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check collision with walls (no wrapping, game ends on border hit)
    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        resetGame();
        return;
    }

    // Check collision with self
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            return;
        }
    }

    // Add new head
    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        currentProgram = programs[Math.floor(Math.random() * programs.length)]; // New program each time
        food = {
            x: Math.floor(Math.random() * tileCountX),
            y: Math.floor(Math.random() * tileCountY),
        };
        // Ensure food doesn't spawn on snake
        while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            food = {
                x: Math.floor(Math.random() * tileCountX),
                y: Math.floor(Math.random() * tileCountY),
            };
        }
    } else {
        snake.pop(); // Remove tail if no food eaten
    }

    // Draw everything
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake (white)
    ctx.fillStyle = 'white';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Draw food (red text for program name)
    ctx.fillStyle = 'red';
    ctx.font = '12px Arial';
    ctx.fillText(currentProgram, food.x * gridSize + 2, food.y * gridSize + 15);

    // Update score
    scoreElement.textContent = `Score: ${score}`;

    // Change direction occasionally for automation
    if (Math.random() < 0.02) { // 2% chance per frame to change direction
        changeDirection();
    }

    setTimeout(gameLoop, 1000 / speed); // Control game speed (7 FPS)
}

function resetGame() {
    snake = [{ x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }];
    food = {
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY),
    };
    dx = 0;
    dy = 0;
    score = 0;
    currentProgram = programs[Math.floor(Math.random() * programs.length)];
    changeDirection(); // Start with a random direction
}

// Start the game
changeDirection(); // Initial direction
gameLoop();

// Handle window resize (keep full-screen)
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    tileCountX = Math.floor(canvas.width / gridSize);
    tileCountY = Math.floor(canvas.height / gridSize);
    resetGame(); // Reset on resize to fit new dimensions
});
