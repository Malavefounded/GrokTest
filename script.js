// Hexagonal grid constants
const GRID_SIZE = 7; // 7x7 hex grid
const HEX_SIZE = 50; // Size of each hexagon
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 700;
const characters = ['Bigbolz', 'Bigballs', 'Elon', 'Mr. Musk', 'Donald Trump', 'The Donald'];
const programs = ['USAID', 'CFPB', 'NOAA', 'FEMA', 'DOE', 'NIH']; // Government programs
let currentProgram = programs[0]; // Start with USAID

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const message = document.getElementById('message');

// Hexagonal grid calculations
function hexToPixel(q, r) {
    const x = HEX_SIZE * (3/2 * q);
    const y = HEX_SIZE * (Math.sqrt(3) * r + Math.sqrt(3)/2 * q);
    return { x: x + CANVAS_WIDTH / 2 - HEX_SIZE * 1.5 * (GRID_SIZE / 2), y: y + CANVAS_HEIGHT / 2 - HEX_SIZE * Math.sqrt(3) * (GRID_SIZE / 2) };
}

function drawHex(q, r, raised = false) {
    const { x, y } = hexToPixel(q, r);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = 2 * Math.PI / 6 * i;
        const px = x + HEX_SIZE * Math.cos(angle);
        const py = y + HEX_SIZE * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    if (raised) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(getRandomCharacter(), 0, 5); // Small text for pins
        ctx.restore();
    } else {
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }
}

// Martian critter (hexagonal USAID stamp/logo as a hexagon with text)
let critterQ = 3, critterR = 3; // Start in center
function drawCritter() {
    const { x, y } = hexToPixel(critterQ, critterR);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = 2 * Math.PI / 6 * i;
        const px = x + HEX_SIZE / 2 * Math.cos(angle);
        const py = y + HEX_SIZE / 2 * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(currentProgram, x, y);
    ctx.fillStyle = 'white'; // Reset for text/pins
}

// Elon/DOGE (player, white hexagonal silhouette)
let playerQ = 0, playerR = 0;
function drawPlayer() {
    const { x, y } = hexToPixel(playerQ, playerR);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = 2 * Math.PI / 6 * i;
        const px = x + HEX_SIZE / 2 * Math.cos(angle);
        const py = y + HEX_SIZE / 2 * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'black'; // Reset fill for hexes
}

// Pins (raised hexagons with random characters)
const pins = [];
function drawPins() {
    pins.forEach(pin => drawHex(pin.q, pin.r, true));
}

function getRandomCharacter() {
    return characters[Math.floor(Math.random() * characters.length)];
}

function canPlacePin(q, r) {
    return !pins.some(pin => pin.q === q && pin.r === r) && !(q === critterQ && r === critterR) && !(q === playerQ && r === playerR);
}

function moveCritter() {
    const directions = [
        [1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]
    ];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    const newQ = critterQ + dir[0];
    const newR = critterR + dir[1];
    if (newQ >= 0 && newQ < GRID_SIZE && newR >= 0 && newR < GRID_SIZE && !pins.some(pin => pin.q === newQ && pin.r === newR)) {
        critterQ = newQ;
        critterR = newR;
    } else if (newQ < 0 || newQ >= GRID_SIZE || newR < 0 || newR >= GRID_SIZE) {
        setTimeout(() => alert('Critter escaped! Try again.'), 100);
        resetRound();
    }
}

function resetRound() {
    pins.length = 0;
    critterQ = 3;
    critterR = 3;
    playerQ = 0;
    playerR = 0;
    currentProgram = programs[Math.floor(Math.random() * programs.length)]; // Random new program each round
    
    // Place 2-3 random pre-existing pins at the start of each round
    const initialPins = Math.floor(Math.random() * 2) + 2; // 2 or 3 pins
    for (let i = 0; i < initialPins; i++) {
        let q, r;
        do {
            q = Math.floor(Math.random() * GRID_SIZE);
            r = Math.floor(Math.random() * GRID_SIZE);
        } while (!canPlacePin(q, r) || (q === critterQ && r === critterR) || (q === playerQ && r === playerR));
        pins.push({ q, r });
    }
    gameLoop();
}

let trapsLeft = 3;
let timeLeft = 30;
let gameInterval;

function gameLoop() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Draw hexagonal grid
    for (let q = 0; q < GRID_SIZE; q++) {
        for (let r = 0; r < GRID_SIZE; r++) {
            drawHex(q, r);
        }
    }
    drawCritter();
    drawPlayer();
    drawPins();
    message.textContent = `Time: ${timeLeft}s | Traps Left: ${trapsLeft}`;

    if (timeLeft <= 0) {
        if (pins.some(pin => pin.q === critterQ && pin.r === critterR)) {
            const fullName = {
                'USAID': 'U.S. Agency for International Development',
                'CFPB': 'Consumer Financial Protection Bureau',
                'NOAA': 'National Oceanic and Atmospheric Administration',
                'FEMA': 'Federal Emergency Management Agency',
                'DOE': 'Department of Education',
                'NIH': 'National Institutes of Health'
            }[currentProgram];
            alert(`Congrats! You’ve captured ${fullName}`);
        } else {
            alert('Time’s up! Critter escaped. Try again.');
        }
        resetRound();
        return;
    }

    timeLeft--;
    if (Math.random() < 0.05) moveCritter(); // Move critter occasionally
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (let q = 0; q < GRID_SIZE; q++) {
        for (let r = 0; r < GRID_SIZE; r++) {
            const { x: hexX, y: hexY } = hexToPixel(q, r);
            const dx = x - hexX;
            const dy = y - hexY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < HEX_SIZE) {
                if (trapsLeft > 0 && canPlacePin(q, r)) {
                    pins.push({ q, r });
                    trapsLeft--;
                }
                break;
            }
        }
    }
    gameLoop();
});

gameInterval = setInterval(gameLoop, 1000);
resetRound(); // Start the game with initial pins
