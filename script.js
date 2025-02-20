const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const programsLeftElement = document.getElementById('programsLeft');
const namesCollectedElement = document.getElementById('namesCollected');
const teamMembersElement = document.getElementById('teamMembers');
const resetText = document.getElementById('resetText');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let snake = [];
let dx = 0;
let dy = 0;
let foods = [];
let score = 0;
let gameSpeed = 100;
let programsLeft = 52;
let fruitEatenCount = 0;
let collectedNames = [];
let teamMembersFound = [];
let killZones = [];
let gameActive = false;

const governmentPrograms = [
    "EPA Regulations", "NASA Funding", "DHS Grants", "DOE Projects", "NOAA Research", "FEMA Aid", 
    "HUD Programs", "Medicaid Expansion", "SNAP Benefits", "Kamala Harris", "Joe Biden"
];

const teamMembers = ["Elon Musk", "Donald Trump", "Marco Rubio", "Scott Bessent", "Russell Vought", "Stephen Miller", "Vivek Ramaswamy"];

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
    const minDistance = 200;

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
        { type: 'L', width: 60, height: 20 },
        { type: 'T', width: 60, height: 20 },
        { type: 'I', width: 20, height: 80 }
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
    if (!gameActive) return;

    ctx.fillStyle = 'green';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    snake.forEach((segment, index) => {
        ctx.fillRect(segment.x, segment.y, 20, 20);
        ctx.fillStyle = 'white';
        ctx.fillText("D.O.G.E", segment.x + 10, segment.y + 10);

        if (fruitEatenCount >= 4 && (snake.length - 4 * Math.floor(fruitEatenCount / 4)) === index + 1) {
            const nameIndex = (Math.floor(fruitEatenCount / 4) - 1) % teamMembers.length;
            const name = teamMembers[nameIndex];
            ctx.fillText(name, segment.x + 10, segment.y + 10 + 15);
            if (!teamMembersFound.includes(name)) {
                teamMembersFound.push(name);
                updateTeamMembersDisplay();
            }
        }
    });
}

function drawFoods() {
    if (!gameActive) return;

    foods.forEach(food => {
        if (food.isProgram) {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(food.x + 10, food.y + 10, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText(food.item, food.x + 10, food.y + 25);
        } else {
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.moveTo(food.x + 10, food.y);
            ctx.lineTo(food.x + 15, food.y + 10);
            ctx.lineTo(food.x + 20, food.y + 10);
            ctx.lineTo(food.x + 13, food.y + 15);
            ctx.lineTo(food.x + 17, food.y + 20);
            ctx.lineTo(food.x + 10, food.y + 15);
            ctx.lineTo(food.x + 3, food.y + 20);
            ctx.lineTo(food.x + 7, food.y + 15);
            ctx.lineTo(food.x, food.y + 10);
            ctx.lineTo(food.x + 5, food.y + 10);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText(food.item, food.x + 10, food.y + 25);
        }
    });
}

function drawKillZones() {
    if (!gameActive) return;

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
            ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
            ctx.fillStyle = 'red';
            ctx.font = '16px Arial';
            ctx.fillText('Killzone', zone.x + zone.width / 2, zone.y + zone.height / 2);
        } else if (zone.type === 'T') {
            ctx.moveTo(zone.x + zone.width / 2, zone.y);
            ctx.lineTo(zone.x + zone.width / 2, zone.y + zone.height);
            ctx.moveTo(zone.x, zone.y + zone.height / 2);
            ctx.lineTo(zone.x + zone.width, zone.y + zone.height / 2);
            ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
            ctx.fillStyle = 'red';
            ctx.font = '16px Arial';
            ctx.fillText('Killzone', zone.x + zone.width / 2, zone.y + zone.height / 2);
        } else if (zone.type === 'I') {
            ctx.moveTo(zone.x + zone.width / 2, zone.y);
            ctx.lineTo(zone.x + zone.width / 2, zone.y + zone.height);
            ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
            ctx.fillStyle = 'red';
            ctx.font = '16px Arial';
            ctx.fillText('Killzone', zone.x + zone.width / 2, zone.y + zone.height / 2);
        }
        ctx.stroke();
    });
}

function moveSnake() {
    if (!gameActive || dx === 0 && dy === 0) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x < 0 || head.x >= canvas.width - 20 || head.y < 0 || head.y >= canvas.height - 20) {
        gameOver();
        return;
    }

    for (let zone of killZones) {
        if (isPointInKillZone(head.x, head.y, zone)) {
            gameOver();
            return;
        }
    }

    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    let foodEaten = false;
    foods = foods.filter(food => {
        if (head.x === food.x && head.y === food.y) {
            if (food.isProgram) {
                score += 5;
                for (let i = 0; i < 5; i++) snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
            } else {
                score += 10;
                for (let i = 0; i < 10; i++) snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
            }
            scoreElement.textContent = `Score: ${score}`;
            if (food.isProgram) {
                programsLeft--;
                programsLeftElement.textContent = `Government Programs Left to Audit: ${programsLeft}`;
            }
            fruitEatenCount++;
            collectedNames.push(food.item);
            updateNamesCollectedDisplay();
            foodEaten = true;
            return false;
        }
        return true;
    });

    if (foodEaten) {
        initFoods();
    } else {
        snake.pop();
    }
}

function gameOver() {
    gameActive = false;
    resetText.style.display = 'block';
    alert(`Game Over! Score: ${score}`);
}

function resetGame() {
    snake = [{ x: Math.floor(canvas.width / 40) * 20, y: Math.floor(canvas.height / 40) * 20 }];
    dx = 0;
    dy = 0;
    score = 0;
    programsLeft = 52;
    fruitEatenCount = 0;
    collectedNames = [];
    teamMembersFound = [];
    foods = [];
    killZones = [];

    scoreElement.textContent = `Score: ${score}`;
    programsLeftElement.textContent = `Government Programs Left to Audit: ${programsLeft}`;
    updateNamesCollectedDisplay();
    updateTeamMembersDisplay();
    initFoods();
    initKillZones();
    gameActive = true;
    resetText.style.display = 'none';
    draw();
}

function updateNamesCollectedDisplay() {
    namesCollectedElement.innerHTML = 'Names Collected (Food Items)<br>' + collectedNames.map(name => `<div>${name}</div>`).join('');
}

function updateTeamMembersDisplay() {
    teamMembersElement.innerHTML = 'Team Members Found (Names on Snake)<br>' + teamMembersFound.map(name => `<div>${name}</div>`).join('');
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameActive) {
        drawSnake();
        drawFoods();
        drawKillZones();
        moveSnake();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        resetGame();
        return;
    }

    if (!gameActive) return;

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

function initGame() {
    gameActive = false;
    resetText.style.display = 'block';
    snake = [];
    dx = 0;
    dy = 0;
    score = 0;
    programsLeft = 52;
    fruitEatenCount = 0;
    collectedNames = [];
    teamMembersFound = [];
    foods = [];
    killZones = [];

    scoreElement.textContent = `Score: ${score}`;
    programsLeftElement.textContent = `Government Programs Left to Audit: ${programsLeft}`;
    updateNamesCollectedDisplay();
    updateTeamMembersDisplay();
}

window.onload = () => {
    initGame();
    setInterval(draw, gameSpeed);
};

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initGame();
});
