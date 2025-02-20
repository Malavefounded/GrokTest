// Global variables
const democratNames = [
    "Kamala Harris", "Joe Biden", "Chuck Schumer", "Hakeem Jeffries", "Elizabeth Warren",
    "Bernie Sanders", "Brian Schatz", "Patty Murray", "Ron Wyden", "Maxine Waters",
    "Alexandria Ocasio-Cortez", "Pramila Jayapal", "Ilhan Omar", "Greg Casar", "Jamie Raskin",
    "Ro Khanna", "Melanie Stansbury", "Maxwell Alejandro Frost", "Becca Balint", "Chris Murphy",
    "Lisa Blunt Rochester", "Jared Golden", "Gerry Connolly", "Don Beyer", "Scott Peters",
    "Tammy Baldwin", "Michael Bennet", "Cory Booker", "Chris Coons", "Tammy Duckworth",
    "Anthony Fauci", "Francis Collins", "Bill Gates", "Clifford Lane", "Hillary Clinton", "Barack Obama"
];
let usedDemocratNames = new Set();
let democratList = [];

const agencyAcronyms = [
    "USAID", "CFPB", "EPA", "Treasury", "DOD", "IRS", "DOE", "SSA", "FEMA", "USPS",
    "HUD", "GSA", "STATE", "SBA", "DOI", "NPS", "OMB", "ED", "OPM", "DOJ",
    "NASA", "VA", "USDA", "FAA", "DOT", "CDC", "NIH", "FDA", "DEA", "SEC"
];
const agencyFullNames = {
    "USAID": "United States Agency for International Development",
    "CFPB": "Consumer Financial Protection Bureau",
    "EPA": "Environmental Protection Agency",
    "Treasury": "United States Department of the Treasury",
    "DOD": "United States Department of Defense",
    "IRS": "Internal Revenue Service",
    "DOE": "United States Department of Energy",
    "SSA": "Social Security Administration",
    "FEMA": "Federal Emergency Management Agency",
    "USPS": "United States Postal Service",
    "HUD": "United States Department of Housing and Urban Development",
    "GSA": "General Services Administration",
    "STATE": "United States Department of State",
    "SBA": "Small Business Administration",
    "DOI": "United States Department of the Interior",
    "NPS": "National Park Service",
    "OMB": "Office of Management and Budget",
    "ED": "United States Department of Education",
    "OPM": "Office of Personnel Management",
    "DOJ": "United States Department of Justice",
    "NASA": "National Aeronautics and Space Administration",
    "VA": "United States Department of Veterans Affairs",
    "USDA": "United States Department of Agriculture",
    "FAA": "Federal Aviation Administration",
    "DOT": "United States Department of Transportation",
    "CDC": "Centers for Disease Control and Prevention",
    "NIH": "National Institutes of Health",
    "FDA": "Food and Drug Administration",
    "DEA": "Drug Enforcement Administration",
    "SEC": "Securities and Exchange Commission"
};
let usedAgencyAcronyms = new Set();
let agencyList = [];

const teamMemberNames = [
    "Susie Wiles", "Lara Trump", "Michael Whatley", "Marco Rubio", "Pete Hegseth",
    "JD Vance", "Elon Musk", "Robert F. Kennedy Jr.", "Tulsi Gabbard", "Howard Lutnick",
    "Scott Bessent", "Pam Bondi", "Sean Duffy", "Lee Zeldin", "Elise Stefanik",
    "John Ratcliffe", "Mike Waltz", "Steve Witkoff", "Doug Collins", "Kristi Noem",
    "Ben Carson", "Linda McMahon", "Stephen Miller", "Tom Homan", "Brendan Carr",
    "Pete Hoekstra", "Mike Huckabee", "Karoline Leavitt", "Chris LaCivita", "James Blair"
];
let usedTeamMemberNames = new Set();
let teamMemberList = [];

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const restartText = document.getElementById('restartText');
    const rulesText = document.getElementById('rulesText');
    const democratsText = document.getElementById('democratsText');
    const agenciesText = document.getElementById('agenciesText');
    const teamMembersText = document.getElementById('teamMembersText');
    const scoreText = document.createElement('div');
    scoreText.className = 'score-text';
    scoreText.textContent = 'Score: 0';
    document.querySelector('.game-container').appendChild(scoreText);

    if (!canvas || !ctx || !restartText || !rulesText || !democratsText || !agenciesText || !teamMembersText || !scoreText) {
        console.error('One or more DOM elements not found. Check your HTML.');
        return;
    }

    const gridSize = 20;
    const tileCountX = canvas.width / gridSize;  // 40
    const tileCountY = canvas.height / gridSize; // 25

    let snake = [{ x: 20, y: 12 }];
    let foods = [
        { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: 'audit', acronym: getRandomAgencyAcronym() },
        { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: 'team', name: getRandomTeamMember() },
        { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: 'audit', acronym: getRandomAgencyAcronym() }
    ];
    let democrats = []; // Start with no Democrats
    let dx = 0, dy = 0;
    let score = 0, gameSpeed = 100, gameActive = true;

    document.addEventListener('keydown', handleKeyPress);

    function handleKeyPress(event) {
        const LEFT_KEY = 37, RIGHT_KEY = 39, UP_KEY = 38, DOWN_KEY = 40, SPACE_KEY = 32;
        const keyPressed = event.keyCode;
        const goingUp = dy === -1, goingDown = dy === 1, goingRight = dx === 1, goingLeft = dx === -1;

        if (keyPressed === SPACE_KEY && !gameActive) {
            restartGame();
            return;
        }
        if (!gameActive) return;

        if (keyPressed === LEFT_KEY && !goingRight) { dx = -1; dy = 0; }
        else if (keyPressed === RIGHT_KEY && !goingLeft) { dx = 1; dy = 0; }
        else if (keyPressed === UP_KEY && !goingDown) { dx = 0; dy = -1; }
        else if (keyPressed === DOWN_KEY && !goingUp) { dx = 0; dy = 1; }
    }

    function getRandomAgencyAcronym() {
        if (usedAgencyAcronyms.size >= agencyAcronyms.length) {
            usedAgencyAcronyms.clear(); // Reset if we run out, to reuse acronyms
            agencyList = [];
        }
        let acronym;
        do { acronym = agencyAcronyms[Math.floor(Math.random() * agencyAcronyms.length)]; } 
        while (usedAgencyAcronyms.has(acronym));
        usedAgencyAcronyms.add(acronym); agencyList.push(acronym); updateUIText(); return acronym;
    }

    function getRandomTeamMember() {
        if (usedTeamMemberNames.size >= teamMemberNames.length) {
            usedTeamMemberNames.clear(); // Reset if we run out, to reuse names
            teamMemberList = [];
        }
        let name;
        do { name = teamMemberNames[Math.floor(Math.random() * teamMemberNames.length)]; } 
        while (usedTeamMemberNames.has(name));
        usedTeamMemberNames.add(name); return name;
    }

    function addAudit() {
        if (usedAgencyAcronyms.size >= agencyAcronyms.length) return;
        const acronym = getRandomAgencyAcronym();
        if (acronym) agencyList.push(agencyFullNames[acronym]); // Use full formal name
        updateUIText();
    }

    function addDemocrat() {
        if (usedDemocratNames.size >= democratNames.length) return;
        const name = democratNames[Math.floor(Math.random() * democratNames.length)];
        if (!usedDemocratNames.has(name)) {
            usedDemocratNames.add(name);
            democratList.push(name);
            democrats.push({
                x: Math.floor(Math.random() * tileCountX),
                y: Math.floor(Math.random() * tileCountY),
                name
            });
            updateUIText();
        }
    }

    function addTeamMember(name) {
        if (!usedTeamMemberNames.has(name)) {
            usedTeamMemberNames.add(name);
            teamMemberList.push(name);
            updateUIText();
        }
    }

    function updateUIText() {
        democratsText.innerHTML = `Democrats Against you:\n${democratList.join('\n') || ''}`;
        agenciesText.innerHTML = `Federal Agencies to Audit:\n${agencyList.join('\n') || ''}`;
        teamMembersText.innerHTML = `Collected Team Members:\n${teamMemberList.map(name => `<span style="margin-right: 15px; display: inline-block;">${name || ''}</span>`).join('') || ''}`;
    }

    function drawGame() {
        if (!gameActive) return;

        try {
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };
            snake.unshift(head);

            let foodEaten = false;
            for (let i = 0; i < foods.length; i++) {
                if (head.x === foods[i]?.x && head.y === foods[i]?.y) { // Use optional chaining for safety
                    if (foods[i].type === 'audit') {
                        score += 30; for (let j = 0; j < 3; j++) snake.push({...snake[snake.length - 1]});
                        addAudit();
                    } else if (foods[i].type === 'team') {
                        score += 10; snake.push({...snake[snake.length - 1]});
                        addTeamMember(foods[i].name || ''); // Fallback if name is undefined
                    }
                    foods.splice(i, 1);
                    foods.push({
                        x: Math.floor(Math.random() * tileCountX),
                        y: Math.floor(Math.random() * tileCountY),
                        type: Math.random() < 0.5 ? 'audit' : 'team',
                        acronym: foods[i].type === 'audit' ? getRandomAgencyAcronym() : null,
                        name: foods[i].type === 'team' ? getRandomTeamMember() : null
                    });
                    foodEaten = true;
                    addDemocrat();
                    break;
                }
            }
            if (!foodEaten) snake.pop();

            if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
                gameOver(); return;
            }
            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    gameOver(); return;
                }
            }
            for (let i = 0; i < democrats.length; i++) {
                if (head.x === democrats[i].x && head.y === democrats[i].y) {
                    gameOver(); return;
                }
            }
            for (let i = 0; i < foods.length; i++) {
                if (head.x === foods[i]?.x && head.y === foods[i]?.y) continue; // Red/green only grow/score, not kill
            }

            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'lime';
            snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2));
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText('D.O.G.E', snake[0].x * gridSize, snake[0].y * gridSize - 5);

            foods.forEach(food => {
                if (!food || !food.type) return; // Skip if food is undefined or missing type
                ctx.fillStyle = food.type === 'audit' ? 'red' : 'green';
                ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
                if (food.type === 'audit' && food.acronym) {
                    ctx.fillStyle = 'white';
                    ctx.font = '10px Arial';
                    const textX = food.x * gridSize + (gridSize - ctx.measureText(food.acronym).width) / 2;
                    ctx.fillText(food.acronym, textX, food.y * gridSize + gridSize + 10);
                }
                if (food.type === 'team' && food.name) {
                    ctx.fillStyle = 'white';
                    ctx.font = '10px Arial';
                    const textX = food.x * gridSize + (gridSize - ctx.measureText(food.name).width) / 2;
                    ctx.fillText(food.name, textX, food.y * gridSize + gridSize + 10);
                } else if (food.type === 'team' && !food.name) {
                    console.warn('Green block missing name, assigning default');
                    food.name = getRandomTeamMember(); // Assign a name if missing
                    ctx.fillStyle = 'white';
                    ctx.font = '10px Arial';
                    const textX = food.x * gridSize + (gridSize - ctx.measureText(food.name).width) / 2;
                    ctx.fillText(food.name, textX, food.y * gridSize + gridSize + 10);
                }
            });

            democrats.forEach(democrat => {
                ctx.fillStyle = 'blue';
                ctx.fillRect(democrat.x * gridSize, democrat.y * gridSize, gridSize - 2, gridSize - 2);
                ctx.fillStyle = 'white';
                ctx.font = '10px Arial';
                const textX = democrat.x * gridSize + (gridSize - ctx.measureText(democrat.name).width) / 2;
                ctx.fillText(democrat.name, textX, democrat.y * gridSize + gridSize + 10);
            });

            scoreText.textContent = `Score: ${score}`;

            setTimeout(drawGame, gameSpeed);
        } catch (error) {
            console.error('Error in drawGame:', error);
            gameOver();
        }
    }

    function gameOver() {
        gameActive = false;
        restartText.style.display = 'block';
    }

    function restartGame() {
        snake = [{ x: 20, y: 12 }];
        foods = [
            { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: 'audit', acronym: getRandomAgencyAcronym() },
            { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: 'team', name: getRandomTeamMember() },
            { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: 'audit', acronym: getRandomAgencyAcronym() }
        ];
        democrats = [];
        dx = 0;
        dy = 0;
        score = 0;
        gameActive = true;
        usedDemocratNames.clear();
        usedAgencyAcronyms.clear();
        usedTeamMemberNames.clear();
        democratList = [];
        agencyList = [];
        teamMemberList = [];
        updateUIText();
        restartText.style.display = 'none';
        drawGame();
    }

    drawGame();
});
