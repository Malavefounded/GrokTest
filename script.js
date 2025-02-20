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
let democrats = []; // Array to store Democrat blocks (bad - causes instant death)
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 100;
let gameActive = true;

// Good food types: Audits (red, +3 size, +30 points) and Team Members (green, +1 size, +10 points)
// Bad blocks: Democrats (blue, instant death on contact)
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
    const head = { x: snake[0].x + dx, y:
