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
let foods = []; // Array to hold 3 programs/figures
let score = 0;
let gameSpeed = 100; // milliseconds between moves
let programsLeft = 52; // Total programs/figures to audit
let fruitEatenCount = 0; // Track number of fruit eaten for name addition
let collectedNames = []; // Track eaten food items (programs/figures)
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

// Key cabinet members Elon Musk is happy working with
const adminNames = ["Donald Trump", "Marco Rubio", "Scott Bessent", "Russell Vought", "Stephen Miller", "Vivek Ramaswamy"];

function initFoods() {
    while (foods.length < 3) {
        let newFood = {
            x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
            y: Math.floor(Math.random() * (canvas.height / 20)) * 20,
            program: governmentPrograms[Math.floor(Math.random() * governmentPrograms.length)]
        };
        // Ensure food doesn’t spawn on snake or overlap other food
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) &&
            !foods.some(food => food.x === newFood.x && food.y === newFood.y)) {
            foods.push(newFood);
        }
    }
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

        // Add additional names every 4 fruit eaten, on the fourth added segment
        if (fruitEatenCount >= 4 && (snake.length - 4 * Math.floor(fruitEatenCount / 4)) === index + 1) {
            const nameIndex = (Math.floor(fruitEatenCount / 4) - 1) % adminNames.length;
            const name = adminNames[nameIndex];
            ctx.fillText(name, segment.x + 10, segment.y + 10 + 15); // Offset below "Doge"
            if (!teamMembersFound.includes(name)) {
                teamMembersFound.push(name);
                updateTeamMembersDisplay();
            }
        }
    });
}

function drawFoods() {
    ctx.fillStyle = 'red';
    foods.forEach(food => {
        // Draw apple (circle) as food
        ctx.beginPath();
        ctx.arc(food.x + 10, food.y + 10, 10, 0, Math.PI * 2);
        ctx.fill();

        // Draw program name below the apple
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(food.program, food.x + 10, food.y + 25); // 15px below the center of the apple
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
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
            programsLeft--;
            programsLeftElement.textContent = `Government Programs Left to Audit: ${programsLeft}`;
            fruitEatenCount++;
            collectedNames.push(food.program); // Add eaten program to collected names
            updateNamesCollectedDisplay();
            foodEaten = true;
            return false; // Remove eaten food
        }
        return true; // Keep uneaten food
    });

    if (foodEaten) {
        initFoods(); // Add new food to maintain 3 programs
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
    updateNamesCollectedDisplay();
    updateTeamMembersDisplay();
    initFoods();
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
    initFoods();
});
