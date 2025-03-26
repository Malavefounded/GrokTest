// Global variables
const democratNames = [
    "Tim Walz", "Kamala Harris", "Joe Biden", "Chuck Schumer", "Elizabeth Warren",
    "Bernie Sanders", "Cory Booker", "Chris Coons", "Dick Durbin", "Mark Kelly",
    "Tammy Baldwin", "Jon Ossoff", "Pramila Jayapal", "Alexandria Ocasio-Cortez", "Ilhan Omar",
    "Nancy Pelosi", "Melanie Stansbury", "Eleanor Holmes Norton", "Jamie Raskin", "Bennie Thompson",
    "Anthony Fauci", "Volodymyr Zelensky", "Ketanji Brown Jackson", "Sonia Sotomayor", "Elena Kagan",
    "Merrick Garland", "Janet Yellen", "Xavier Becerra", "Pete Buttigieg", "Gina Raimondo",
    "Deb Haaland", "Tom Vilsack", "Lloyd Austin", "Antony Blinken", "Jennifer Granholm",
    "Marty Walsh", "Miguel Cardona", "Rochelle Walensky", "Robert Califf", "Lina Khan",
    "Jessica Rosenworcel", "Christopher Wray", "Avril Haines", "Michael Regan", "Shalanda Young",
    "Rohit Chopra", "Julie Su", "Eric Lander", "John Kerry", "Al Gore"
];
const democratDetails = {
    "Tim Walz": "(MN Governor) – Opposes efficiency cuts to progressive programs, per web",
    "Kamala Harris": "(VP, CA) – Opposes audits undermining Biden’s policies, per web",
    "Joe Biden": "(President, DE) – Opposes audits threatening Democratic priorities, per web",
    "Chuck Schumer": "(NY, Senator) – Opposes audits cutting social programs, per web",
    "Elizabeth Warren": "(MA, Senator) – Opposes audits on consumer protections, per web",
    "Bernie Sanders": "(VT, Senator) – Opposes efficiency cuts to safety nets, per web",
    "Cory Booker": "(NJ, Senator) – Opposes audits on housing/education, per web",
    "Chris Coons": "(DE, Senator) – Opposes audits weakening foreign aid, per web",
    "Dick Durbin": "(IL, Senator) – Opposes cuts to judicial/labor, per web",
    "Mark Kelly": "(AZ, Senator) – Opposes audits on space/veterans, per web",
    "Tammy Baldwin": "(WI, Senator) – Opposes cuts to healthcare/labor, per web",
    "Jon Ossoff": "(GA, Senator) – Opposes audits on tech/infrastructure, per web",
    "Pramila Jayapal": "(WA, House Rep) – Opposes efficiency cuts to progressives, per web",
    "Alexandria Ocasio-Cortez": "(NY, House Rep) – Opposes audits on Green New Deal, per web",
    "Ilhan Omar": "(MN, House Rep) – Opposes audits reducing social justice, per web",
    "Nancy Pelosi": "(CA, Former Speaker) – Opposes audits cutting Democratic priorities, per web",
    "Melanie Stansbury": "(NM, House Rep) – Opposes cuts to working-class programs, per web",
    "Eleanor Holmes Norton": "(DC, House Delegate) – Opposes audits harming D.C. programs, per web",
    "Jamie Raskin": "(MD, House Rep) – Opposes audits on Jan. 6 work, per web",
    "Bennie Thompson": "(MS, House Rep) – Opposes audits threatening Jan. 6 findings, per web",
    "Anthony Fauci": "(Former NIAID Director) – Opposes audits of COVID response, per web",
    "Volodymyr Zelensky": "(Ukraine President) – Opposes audits cutting Ukraine aid, per web",
    "Ketanji Brown Jackson": "(U.S. Supreme Court Justice) – Opposes audits on judiciary, per web",
    "Sonia Sotomayor": "(U.S. Supreme Court Justice) – Opposes audits on social programs, per web",
    "Elena Kagan": "(U.S. Supreme Court Justice) – Opposes audits politicizing judiciary, per web",
    "Merrick Garland": "(U.S. Attorney General) – Opposes audits of DOJ, per web",
    "Janet Yellen": "(U.S. Treasury Secretary) – Opposes Fed audits/cuts, per web",
    "Xavier Becerra": "(U.S. HHS Secretary) – Opposes audits of health programs, per web",
    "Pete Buttigieg": "(U.S. Transportation Secretary) – Opposes audits on infrastructure, per web",
    "Gina Raimondo": "(U.S. Commerce Secretary) – Opposes audits on commerce, per web",
    "Deb Haaland": "(U.S. Interior Secretary) – Opposes cuts to environmental programs, per web",
    "Tom Vilsack": "(U.S. Agriculture Secretary) – Opposes audits of USDA, per web",
    "Lloyd Austin": "(U.S. Defense Secretary) – Opposes audits of DOD, per web",
    "Antony Blinken": "(U.S. State Secretary) – Opposes audits on foreign aid, per web",
    "Jennifer Granholm": "(U.S. Energy Secretary) – Opposes audits on energy, per web",
    "Marty Walsh": "(Former U.S. Labor Secretary) – Opposes cuts to labor, per web",
    "Miguel Cardona": "(U.S. Education Secretary) – Opposes audits of education, per web",
    "Rochelle Walensky": "(Former CDC Director) – Opposes audits of COVID response, per web",
    "Robert Califf": "(FDA Commissioner) – Opposes audits of health agencies, per web",
    "Lina Khan": "(FTC Chair) – Opposes audits on consumer protections, per web",
    "Jessica Rosenworcel": "(FCC Chair) – Opposes audits on communications, per web",
    "Christopher Wray": "(FBI Director) – Opposes audits of FBI, per web",
    "Avril Haines": "(U.S. DNI Director) – Opposes audits on intelligence, per web",
    "Michael Regan": "(EPA Administrator) – Opposes cuts to environmental programs, per web",
    "Shalanda Young": "(OMB Director) – Opposes audits of budgeting, per web",
    "Rohit Chopra": "(CFPB Director) – Opposes audits on consumer finance, per web",
    "Julie Su": "(U.S. Acting Labor Secretary) – Opposes cuts to labor, per web",
    "Eric Lander": "(Former OSTP Director) – Opposes audits of science, per web",
    "John Kerry": "(Former Special Envoy) – Opposes audits on climate, per web",
    "Al Gore": "(Former VP) – Opposes audits reducing climate action, per web"
};

const agencyAcronyms = [
    "FEMA", "CIA", "FBI", "HUD", "USDA", "DOD", "DOE", "STATE", "Treasury", "DOJ",
    "NASA", "VA", "EPA", "IRS", "SSA", "USPS", "NPS", "GSA", "USAID", "OPM",
    "SBA", "DOI", "DOT", "CDC", "NIH", "FDA", "DEA", "SEC", "DHS", "DOC",
    "ED", "DOL", "TSA", "BOP", "NRC", "ATF", "FAA", "FTC", "FCC", "OSHA",
    "HHS", "OMB", "CFPB", "NCIS", "ICE", "CBP", "USCG", "AMTRAK", "NSF", "Smithsonian"
];
const agencyFullNames = {
    "FEMA": "Federal Emergency Management Agency",
    "CIA": "Central Intelligence Agency",
    "FBI": "Federal Bureau of Investigation",
    "HUD": "U.S. Department of Housing and Urban Development",
    "USDA": "U.S. Department of Agriculture",
    "DOD": "U.S. Department of Defense",
    "DOE": "U.S. Department of Energy",
    "STATE": "U.S. Department of State",
    "Treasury": "U.S. Department of the Treasury",
    "DOJ": "U.S. Department of Justice",
    "NASA": "National Aeronautics and Space Administration",
    "VA": "U.S. Department of Veterans Affairs",
    "EPA": "Environmental Protection Agency",
    "IRS": "Internal Revenue Service",
    "SSA": "Social Security Administration",
    "USPS": "United States Postal Service",
    "NPS": "National Park Service",
    "GSA": "General Services Administration",
    "USAID": "U.S. Agency for International Development",
    "OPM": "Office of Personnel Management",
    "SBA": "Small Business Administration",
    "DOI": "U.S. Department of the Interior",
    "DOT": "U.S. Department of Transportation",
    "CDC": "Centers for Disease Control and Prevention",
    "NIH": "National Institutes of Health",
    "FDA": "Food and Drug Administration",
    "DEA": "Drug Enforcement Administration",
    "SEC": "Securities and Exchange Commission",
    "DHS": "U.S. Department of Homeland Security",
    "DOC": "U.S. Department of Commerce",
    "ED": "U.S. Department of Education",
    "DOL": "U.S. Department of Labor",
    "TSA": "Transportation Security Administration",
    "BOP": "Bureau of Prisons",
    "NRC": "Nuclear Regulatory Commission",
    "ATF": "Bureau of Alcohol, Tobacco, Firearms and Explosives",
    "FAA": "Federal Aviation Administration",
    "FTC": "Federal Trade Commission",
    "FCC": "Federal Communications Commission",
    "OSHA": "Occupational Safety and Health Administration",
    "HHS": "U.S. Department of Health and Human Services",
    "OMB": "Office of Management and Budget",
    "CFPB": "Consumer Financial Protection Bureau",
    "NCIS": "Naval Criminal Investigative Service",
    "ICE": "U.S. Immigration and Customs Enforcement",
    "CBP": "U.S. Customs and Border Protection",
    "USCG": "United States Coast Guard",
    "AMTRAK": "National Railroad Passenger Corporation",
    "NSF": "National Science Foundation",
    "Smithsonian": "Smithsonian Institution"
};
let usedAgencyAcronyms = new Set();
let agencyList = new Set();
let usedDemocratNames = new Set();
let democratList = [];

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartText = document.getElementById('restartText');
const rulesText = document.getElementById('rulesText');
const democratsText = document.getElementById('democratsText');
const agenciesText = document.getElementById('agenciesText');
const restartButton = document.getElementById('restartButton');
const scoreText = document.createElement('div');
scoreText.className = 'score-text';
scoreText.textContent = 'Score: 0';
document.querySelector('.game-container').appendChild(scoreText);

// Set canvas size dynamically
const maxWidth = 800;
const maxHeight = 500;
const isMobile = window.innerWidth <= 850;
canvas.width = isMobile ? window.innerWidth * 0.9 : maxWidth;
canvas.height = isMobile ? (canvas.width / maxWidth) * maxHeight : maxHeight;

const gridSize = 20;
const tileCountX = canvas.width / gridSize;
const tileCountY = canvas.height / gridSize;

let snake = [{ x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }];
let foods = [
    { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: 'audit', acronym: getRandomAgencyAcronym() },
    { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: 'audit', acronym: getRandomAgencyAcronym() },
    { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: 'audit', acronym: getRandomAgencyAcronym() }
];
let democrats = [];
let dx = 0, dy = 0;
let score = 0, gameActive = true;
let touchStartX = 0, touchStartY = 0;
const swipeThreshold = 30;
const targetFPS = 10; // Target 10 frames per second
const frameInterval = 1000 / targetFPS; // 100ms per frame
let lastFrameTime = 0;

// Prevent scrolling with arrow keys on PC
document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
});

// Prevent default touch behavior
document.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

document.addEventListener('keydown', handleKeyPress);
canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
restartButton.addEventListener('touchstart', handleRestartTouch, { passive: false });

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

function handleTouchStart(event) {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    console.log('Touch Start:', touchStartX, touchStartY);
}

function handleTouchMove(event) {
    if (!gameActive) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const goingUp = dy === -1, goingDown = dy === 1, goingRight = dx === 1, goingLeft = dx === -1;

    console.log('Touch Move - Delta:', deltaX, deltaY);

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0 && !goingLeft) { dx = 1; dy = 0; console.log('Swipe Right'); }
        else if (deltaX < 0 && !goingRight) { dx = -1; dy = 0; console.log('Swipe Left'); }
    } else if (Math.abs(deltaY) > swipeThreshold) {
        if (deltaY > 0 && !goingUp) { dx = 0; dy = 1; console.log('Swipe Down'); }
        else if (deltaY < 0 && !goingDown) { dx = 0; dy = -1; console.log('Swipe Up'); }
    }

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

function handleRestartTouch(event) {
    event.preventDefault();
    if (!gameActive) {
        console.log('Restart Button Tapped');
        restartGame();
    }
}

function getRandomAgencyAcronym() {
    if (usedAgencyAcronyms.size >= agencyAcronyms.length) {
        usedAgencyAcronyms.clear();
        agencyList.clear();
    }
    let acronym;
    do { acronym = agencyAcronyms[Math.floor(Math.random() * agencyAcronyms.length)]; } 
    while (usedAgencyAcronyms.has(acronym));
    usedAgencyAcronyms.add(acronym);
    return acronym;
}

function getRandomDemocrat() {
    if (usedDemocratNames.size >= democratNames.length) {
        usedDemocratNames.clear();
        democratList = [];
    }
    let name;
    do { name = democratNames[Math.floor(Math.random() * democratNames.length)]; } 
    while (usedDemocratNames.has(name));
    usedDemocratNames.add(name);
    democratList.push(name);
    updateUIText();
    return name;
}

function addAudit() {
    if (usedAgencyAcronyms.size >= agencyAcronyms.length) return;
    const acronym = foods.find(food => food.type === 'audit' && snake[0].x === food.x && snake[0].y === food.y)?.acronym;
    if (acronym) {
        agencyList.add(acronym);
        usedAgencyAcronyms.add(acronym);
    }
    updateUIText();
    addDemocrat();
}

function addDemocrat() {
    if (usedDemocratNames.size >= democratNames.length) return;
    const name = getRandomDemocrat();
    democrats.push({
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY),
        name
    });
    updateUIText();
}

function updateUIText() {
    democratsText.innerHTML = `<strong style="color: white;">Democrats Against you:</strong>\n${democratList.map(name => `${name} ${democratDetails[name] || ''}`).join('\n') || ''}`;
    agenciesText.innerHTML = `<strong style="color: white;">Federal Agencies to Audit:</strong>\n${[...agencyList].map(acronym => agencyFullNames[acronym] || acronym).join('\n') || ''}`;
}

function drawGame(timestamp) {
    if (!lastFrameTime) lastFrameTime = timestamp;
    const elapsed = timestamp - lastFrameTime;

    if (elapsed < frameInterval) {
        requestAnimationFrame(drawGame);
        return;
    }

    lastFrameTime = timestamp;

    if (!gameActive) {
        restartText.style.display = 'block';
        restartButton.style.display = isMobile ? 'block' : 'none';
        return;
    }

    try {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        let foodEaten = false;
        for (let i = 0; i < foods.length; i++) {
            if (head.x === foods[i]?.x && head.y === foods[i]?.y) {
                if (foods[i].type === 'audit') {
                    score += 30;
                    for (let j = 0; j < 3; j++) snake.push({...snake[snake.length - 1]});
                    addAudit();
                }
                foods.splice(i, 1);
                foods.push({
                    x: Math.floor(Math.random() * tileCountX),
                    y: Math.floor(Math.random() * tileCountY),
                    type: 'audit',
                    acronym: getRandomAgencyAcronym()
                });
                foodEaten = true;
                break;
            }
        }
        if (!foodEaten) snake.pop();

        if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
            gameActive = false;
            return;
        }
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameActive = false;
                return;
            }
        }
        for (let i = 0; i < democrats.length; i++) {
            if (head.x === democrats[i].x && head.y === democrats[i].y) {
                gameActive = false;
                return;
            }
        }

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'lime';
        snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2));
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText('D.O.G.E', snake[0].x * gridSize, snake[0].y * gridSize - 5);

        foods.forEach(food => {
            if (!food || !food.type || food.type !== 'audit') return;
            ctx.fillStyle = 'red';
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
            if (food.type === 'audit' && !food.acronym) {
                food.acronym = getRandomAgencyAcronym();
            }
            if (food.type === 'audit' && food.acronym) {
                ctx.fillStyle = 'white';
                ctx.font = '10px Arial';
                const textX = food.x * gridSize + (gridSize - ctx.measureText(food.acronym).width) / 2;
                ctx.fillText(food.acronym, textX, food.y * gridSize + gridSize + 10);
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

        requestAnimationFrame(drawGame);
    } catch (error) {
        console.error('Error in drawGame:', error);
        gameActive = false;
    }
}

function restartGame() {
    snake = [{ x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }];
    foods = [
        { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: 'audit', acronym: getRandomAgencyAcronym() },
        { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: 'audit', acronym: getRandomAgencyAcronym() },
        { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: 'audit', acronym: getRandomAgencyAcronym() }
    ];
    democrats = [];
    dx = 0;
    dy = 0;
    score = 0;
    gameActive = true;
    usedAgencyAcronyms.clear();
    usedDemocratNames.clear();
    agencyList.clear();
    democratList = [];
    updateUIText();
    restartText.style.display = 'none';
    restartButton.style.display = 'none';
    lastFrameTime = 0;
    requestAnimationFrame(drawGame);
}

// Start the game
requestAnimationFrame(drawGame);
