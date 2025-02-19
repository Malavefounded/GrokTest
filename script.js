const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const programsLeftElement = document.getElementById('programsLeft');
const namesCollectedElement = document.getElementById('namesCollected');
const teamMembersElement = document.getElementById('teamMembers');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Ensure snake starts in the exact center middle, snapped to grid
let snake = [
    { x: Math.floor(canvas.width / 40) * 20, y: Math.floor(canvas.height / 40) * 20 } // Center middle, snapped to grid
];
let dx = 0; // Start stationary, controlled by keys
let dy = 0;
let foods = []; // Array to hold 3 items (government programs and team members)
let score = 0;
let gameSpeed = 100; // milliseconds between moves
let programsLeft = 52; // Total government programs to audit
let fruitEatenCount = 0; // Track number of items eaten for name addition
let collectedNames = []; // Track eaten food items (programs/figures and team members)
let teamMembersFound = []; // Track names added to snake

// Government programs and figures Elon Musk/DOGE are targeting (including Kamala Harris and Joe Biden)
const governmentPrograms = [
    "USPS", "EPA Regulations", "NASA Funding", "DHS Grants", "DOE Projects", "NOAA Research", "FEMA Aid", 
    "HUD Programs", "Medicaid Expansion", "SNAP Benefits", "Kamala Harris", "Joe Biden", 
    "Department of Education", "Small Business Administration (SBA)", "Consumer Financial Protection Bureau (CFPB)", 
    "General Services Administration (GSA)", "National Endowment for Democracy", "Federal Aviation Administration (FAA)", 
    "Federal Bureau of Investigation (FBI)", "Office of Personnel Management (OPM)", "Treasury Payment Systems", 
    "Institute of Education Sciences (IES)", "Diversity, Equity, and Inclusion (DEI) Programs", "Foreign Aid Programs", 
    "Humanitarian Aid Programs", "Development Programs", "Security Programs", "State Department Programs", 
    "Federal Student Loan Programs", "Federal Research Contracts", "Federal Workforce Programs", 
    "Environmental Protection Agency (EPA) Programs", "Department of Labor Programs", 
    "Department of Health and Human Services (HHS) Programs", "Department of Agriculture Programs", 
    "Department of Energy Programs", "Department of Commerce Programs", "Department of Defense Programs", 
    "Department of Justice Programs", "Department of Transportation Programs", "Department of Housing and Urban Development (HUD) Programs", 
    "Department of the Interior Programs", "Department of Veterans Affairs (VA) Programs", "National Science Foundation (NSF) Programs", 
    "National Institutes of Health (NIH) Programs", "Federal Communications Commission (FCC) Programs", 
    "Federal Trade Commission (FTC) Programs", "Securities and Exchange Commission (SEC) Programs", 
    "Federal Reserve Programs", "Amtrak Programs", "Public Broadcasting Service (PBS) Funding", 
    "National Park Service Programs", "Food and Drug Administration (FDA) Programs", "Centers for Disease Control and Prevention (CDC) Programs"
];

// Key team members Elon Musk is happy working with
const teamMembers = ["Elon Musk", "Donald Trump", "Marco Rubio", "Scott Bessent", "Russell Vought", "Stephen Miller", "Vivek Ramaswamy"];

let killZones = []; // Array to hold 3 kill zones

function initFoods() {
    while (foods.length < 3) {
        let newFood = {
            x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
            y: Math.floor(Math.random() * (canvas.height / 20)) * 20,
            isProgram: Math.random() < 0.7, // 70% chance for government program, 30% for team member
            item: Math.random() < 0.7 ? 
                governmentPrograms[Math.floor(Math.random() * governmentPrograms.length)] : 
                teamMembers[Math.floor(Math.random() * teamMembers.length)]
        };
        // Ensure food doesn’t spawn on snake, kill zones, or overlap other food
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) &&
            !foods.some(food => food.x === newFood.x && food.y === newFood.y) &&
            !killZones.some(zone => isPointInKillZone(newFood.x, newFood.y, zone))) {
            foods.push(newFood);
        }
    }
}

function initKillZones() {
    killZones = [];
    const centerX = Math.floor(canvas.width / 40) * 20;
    const centerY = Math.floor(canvas.height / 40) * 20;
    const minDistance = 100; // Ensure kill zones are far from center

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
    } while (Math.abs(x - Math.floor(canvas.width / 40) * 20) < 100 && Math.abs(y - Math.floor(canvas.height / 40) * 20) < 100);

    return { x, y, width: shape.width, height: shape.height, type: shape.type };
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
        } else if (zone.type === 'T') {
            ctx.moveTo(zone.x + zone.width / 2, zone.y);
            ctx.lineTo(zone.x + zone.width / 2, zone.y + zone.height);
            ctx.moveTo(zone.x, zone.y + zone.height / 2);
            ctx.lineTo(zone.x + zone.width, zone.y + zone.height / 2);
        } else if (zone.type === 'I') {
            ctx.moveTo(zone.x + zone.width / 2, zone.y);
            ctx.lineTo(zone.x + zone.width / 2, zone.y + zone.height);
        }
        ctx.stroke();
    });
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
    const overlap = (zone1.x < zone2.x + zone2.width && zone1.x + zone1.width > zone2.x &&
                     zone1.y < zone2.y + zone2.height && zone1.y + zone1.height > zone2.y);
    return overlap || 
           (zone1.type === 'L' && zone2.type === 'L' && checkComplexOverlap(zone1, zone2)) ||
           (zone1.type === 'T' && zone2.type === 'T' && checkComplexOverlap(zone1, zone2)) ||
           (zone1.type === 'I' && zone2.type === 'I' && checkComplexOverlap(zone1, zone2));
}

function checkComplexOverlap(zone1, zone2) {
    // Simplified overlap check for complex shapes (can be refined if needed)
    return Math.hypot(zone1.x - zone2.x, zone1.y - zone2.y) < (zone1.width + zone2.width) / 2;
}

function drawSnake() {
    ctx.fillStyle = 'green'; // Snake body color
    ctx.font = '16px Arial'; // Font for names
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    snake.forEach((segment, index) => {
        // Draw thick snake segment (20x20 pixels)
        ctx.fillRect(segment.x, segment.y, 20, 20);

        // Always show "Doge" as the main name on every segment
        ctx.fillStyle = 'white';
        ctx.fillText("Doge", segment.x + 10, segment.y + 10);

        // Add additional names every 4 items eaten, on the fourth added segment
        if (fruitEatenCount >= 4 && (snake.length - 4 * Math.floor(fruitEatenCount / 4)) === index + 1) {
            const nameIndex = (Math.floor(fruitEatenCount / 4) - 1) % teamMembers.length;
            const name = teamMembers[nameIndex];
            ctx.fillText(name, segment.x + 10, segment.y + 10 + 15); // Offset below "Doge"
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

function moveSnake() {
    // Only move if dx or dy is non-zero (prevent accidental movement)
    if (dx === 0 && dy === 0) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check collision with walls (kill zones)
    if (head.x < 0 || head.x >= canvas.width - 20 || head.y < 0 || head.y >= canvas.height - 20) {
        gameOver();
        return;
    }

    // Check collision with kill zones
    for (let zone of killZones) {
        if (isPointInKillZone(head.x, head.y, zone)) {
            gameOver();
            return;
        }
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
            if (food.isProgram) {
                score += 5; // 5 points for government programs
                for (let i = 0; i < 5; i++) snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y }); // 5 size increase
            } else {
                score += 10; // 10 points for team members
                snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y }); // 1 size increase
            }
            scoreElement.textContent = `Score: ${score}`;
            if (food.isProgram) {
                programsLeft--;
                programsLeftElement.textContent = `Government Programs Left to Audit: ${programsLeft}`;
            }
            fruitEatenCount++;
            collectedNames.push(food.item); // Add eaten item to collected names
            updateNamesCollectedDisplay();
            foodEaten = true;
            return false; // Remove eaten food
        }
        return true; // Keep uneaten food
    });

    if (foodEaten) {
        initFoods(); // Add new food to maintain 3 items
    } else {
        snake.pop(); // Remove tail if no food eaten
    }
}

function gameOver() {
    alert(`Game Over! Score: ${score}`);
    snake = [{ x: Math.floor(canvas.width / 40) * 20, y: Math.floor(canvas.height / 40) * 20 }]; // Reset to center middle, snapped to grid
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    programsLeft = 52;
    programsLeftElement.textContent = `Government Programs Left to Audit: ${programsLeft}`;
    fruitEatenCount = 0;
    collectedNames = [];
    teamMembersFound = [];
    foods = [];
    killZones = [];
    updateNamesCollectedDisplay();
    updateTeamMembersDisplay();
    initFoods();
    initKillZones();
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

    drawSnake();
    drawFoods();
    drawKillZones();
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
initKillZones();
updateNamesCollectedDisplay();
updateTeamMembersDisplay();
setInterval(draw, gameSpeed);

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    snake = [{ x: Math.floor(canvas.width / 40) * 20, y: Math.floor(canvas.height / 40) * 20 }]; // Reset snake position to center middle, snapped to grid
    dx = 0;
    dy = 0;
    foods = [];
    killZones = [];
    initFoods();
    initKillZones();
});
