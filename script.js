const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const programsLeftElement = document.getElementById('programsLeft');
const namesCollectedElement = document.getElementById('namesCollected');
const teamMembersElement = document.getElementById('teamMembers');

// Ensure canvas dimensions are set immediately
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let snake = [
    { x: Math.floor(canvas.width / 40) * 20, y: Math.floor(canvas.height / 40) * 20 }
];
let dx = 0; // Start stationary, no movement until key press
let dy = 0;
let foods = []; // Array to hold exactly 2 items (government program and team member)
let score = 0;
let gameSpeed = 100; // milliseconds between moves
let programsLeft = 52; // Total government programs to audit
let fruitEatenCount = 0; // Track number of items eaten for name addition
let collectedNames = []; // Track eaten food items (programs/figures and team members)
let teamMembersFound = []; // Track names added to snake

// Government programs Elon Musk/DOGE will audit (simplified list for 2 items)
const governmentPrograms = [
    "EPA Regulations", "NASA Funding", "DHS Grants", "DOE Projects", "NOAA Research", "FEMA Aid", 
    "HUD Programs", "Medicaid Expansion", "SNAP Benefits", "Kamala Harris", "Joe Biden"
];

// Key team members in Donald Trump’s current team that Elon trusts and is happy with (as of February 2025)
const teamMembers = ["Elon Musk", "Donald Trump", "Marco Rubio", "Scott Bessent", "Russell Vought", "Stephen Miller", "Vivek Ramaswamy"];

let killZones = []; // Array to hold 3 kill zones

function initFoods() {
    foods = [
        {
            x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
            y: Math.floor(Math.random() * (canvas.height / 20)) * 20,
            isProgram: true,
            item: governmentPrograms[Math.floor(Math.random() * governmentPrograms.length)]
        },
        {
            x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
            y: Math.floor(Math.random() * (canvas.height / 20)) * 20,
            isProgram: false,
            item: teamMembers[Math.floor(Math.random() * teamMembers.length)]
        }
    ];

    // Ensure foods don’t spawn on snake, kill zones, or overlap each other
    foods.forEach(food => {
        while (snake.some(segment => segment.x === food.x && segment.y === food.y) ||
               foods.some(f => f !== food && f.x === food.x && f.y === food.y) ||
               killZones.some(zone => isPointInKillZone(food.x, food.y, zone))) {
            food.x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
            food.y = Math.floor(Math.random() * (canvas.height / 20)) * 20);
        }
    });
}

function initKillZones() {
    killZones = [];
    const centerX = Math.floor(canvas.width / 40) * 20;
    const centerY = Math.floor(canvas.height / 40) * 20;
    const minDistance = 200; // Ensure kill zones are far from center

    while (killZones.length < 3) {
        let zone = generateRandomKillZone();
        if (!killZones.some(kz => doZonesOverlap(kz, zone)) &&
            Math.hypot(zone.x - centerX, zone.y - centerY) > minDistance) {
            killZones.push(zone);
        }
    }
}

function generateRandomKillZone() {
    const shapes = [
        { type: 'L', width: 60, height: 20 }, // L-shaped (vertical + horizontal)
        { type: 'T', width: 60, height: 20 }, // T-shaped
        { type: 'I', width: 20, height: 80 }  // I-shaped
    ];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    let x, y;

    do {
        x = Math.floor(Math.random() * (canvas.width / 20 - (shape.width / 20))) * 20;
        y = Math.floor(Math.random() * (canvas.height / 20 - (shape.height / 20))) * 20;
    } while (Math.abs(x - Math.floor(canvas.width / 40) * 20) < 200 && Math.abs(y - Math.floor(canvas.height / 40) * 20) < 200);

    return { x, y, width: shape.width, height: shape.height, type: shape.type };
}

function isPointInKillZone(x, y, zone) {
    if (zone.type === 'L') {
        return (x >= zone.x && x <= zone.x + zone.width && y >= zone.y && y <= zone.y + zone.height) ||
               (x >= zone.x + zone.width - zone.height && x <= zone.x + zone.width && y >= zone.y && y <= zone.y + zone.height);
    } else if (zone.type === 'T') {
        return (x >= zone.x && x <= zone.x + zone.width && y >= zone.y + zone.height / 2 && y <= zone.y + zone.height) ||
               (x >= zone.x + zone.width / 2 - zone.width / 2 && x <= zone.x + zone.width / 2 + zone.width / 2 && y >= zone.y && y <= zone.y + zone.height / 2);
    } else if (zone.type === 'I') {
        return x >= zone.x + zone.width / 2 - 5 && x <= zone.x + zone.width / 2 + 5 && y >= zone.y && y <= zone.y + zone.height;
    }
    return false;
}

function doZonesOverlap(zone1, zone2) {
    return (zone1.x < zone2.x + zone2.width && zone1.x + zone1.width > zone2.x &&
            zone1.y < zone2.y + zone2.height && zone1.y + zone1.height > zone2.y);
}

function drawSnake() {
    ctx.fillStyle = 'green'; // Snake body color
    ctx.font = '16px Arial'; // Font for names
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    snake.forEach((segment, index) => {
        ctx.fillRect(segment.x, segment.y, 20, 20); // Draw thick snake segment
        ctx.fillStyle = 'white';
        ctx.fillText("D.O.G.E", segment.x + 10, segment.y + 10); // Always show "D.O.G.E"

        // Add additional names every 4 items eaten, on the fourth added segment
        if (fruitEatenCount >= 4 && (snake.length - 4 * Math.floor(fruitEatenCount / 4)) === index + 1) {
            const nameIndex = (Math.floor(fruitEatenCount / 4) - 1) % teamMembers.length;
            const name = teamMembers[nameIndex];
            ctx.fillText(name, segment.x + 10, segment.y + 10 + 15); // Offset below "D.O.G.E"
            if (!teamMembersFound.includes(name)) {
                teamMembersFound.push(name);
                updateTeamMembersDisplay();
            }
        }
    });
}

function drawFoods() {
    foods.forEach(food => {
        if (food.isProgram) {
            ctx.fillStyle = 'red'; // Government programs (apples)
            ctx.beginPath();
            ctx.arc(food.x + 10, food.y + 10, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText(food.item, food.x + 10, food.y + 25); // Label below apple
        } else {
            ctx.fillStyle = 'blue'; // Team members (stars)
            ctx.beginPath();
            ctx.moveTo(food.x + 10, food.y); // Top point
            ctx.lineTo(food.x + 15, food.y + 10); // Right point
            ctx.lineTo(food.x + 20, food.y + 10); // Right-middle point
            ctx.lineTo(food.x + 13, food.y + 15); // Bottom-middle point
            ctx.lineTo(food.x + 17, food.y + 20); // Bottom point
            ctx.lineTo(food.x + 10, food.y + 15); // Left-middle point
            ctx.lineTo(food.x + 3, food.y + 20); // Left-bottom point
            ctx.lineTo(food.x + 7, food.y + 15); // Left-middle (bottom)
            ctx.lineTo(food.x, food.y + 10); // Left point
            ctx.lineTo(food.x + 5, food.y + 10); // Left-middle (top)
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText(food.item, food.x + 10, food.y + 25); // Label below star
        }
    });
}

function drawKillZones() {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    killZones.forEach(zone => {
        ctx.beginPath();
        if (zone.type === 'L') {
            ctx.moveTo(zone.x, zone.y);
            ctx.lineTo(zone.x + zone.width, zone.y);
            ctx.lineTo(zone.x + zone.width, zone.y + zone.height);
            ctx.moveTo(zone.x + zone.width, zone.y);
            ctx.lineTo(zone.x + zone.width - zone.height, zone.y);
            ctx.strokeRect(zone.x, zone.y, zone.width, zone.height); // Draw collision box
            ctx.fillStyle = 'red';
            ctx.font = '16px Arial';
            ctx.fillText('Killzone', zone.x + zone.width / 2, zone.y + zone.height / 2);
        } else if (zone.type === 'T') {
            ctx.moveTo(zone.x + zone.width / 2, zone.y);
            ctx.lineTo(zone.x + zone.width / 2, zone.y + zone.height);
            ctx.moveTo(zone.x, zone.y + zone.height / 2);
            ctx.lineTo(zone.x + zone.width, zone.y + zone.height / 2);
            ctx.strokeRect(zone.x, zone.y, zone.width, zone.height); // Draw collision box
            ctx.fillStyle = 'red';
            ctx.font = '16px Arial';
            ctx.fillText('Kill
