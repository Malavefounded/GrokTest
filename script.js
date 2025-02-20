document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const restartText = document.getElementById('restartText');
    const rulesText = document.getElementById('rulesText');
    const democratsText = document.getElementById('democratsText');
    const agenciesText = document.getElementById('agenciesText');
    const scoreText = document.createElement('div');
    scoreText.className = 'score-text';
    scoreText.textContent = 'Score: 0';
    document.querySelector('.game-container').appendChild(scoreText);

    if (!canvas || !ctx || !restartText || !rulesText || !democratsText || !agenciesText || !scoreText) {
        console.error('One or more DOM elements not found. Check your HTML.');
        return;
    }

    const gridSize = 20;
    const tileCountX = canvas.width / gridSize;  // 40
    const tileCountY = canvas.height / gridSize; // 25

    let snake = [{ x: 20, y: 12 }];
    let foods = [
        { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: Math.random() < 0.5 ? 'audit' : 'team' },
        { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: Math.random() < 0.5 ? 'audit' : 'team' },
        { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: Math.random() < 0.5 ? 'audit' : 'team' }
    ];
    let democrats = []; // Start with no Democrats
    let dx = 0, dy = 0;
    let score = 0, gameSpeed = 100, gameActive = true;

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
    let usedAgencyAcronyms = new Set();
    let agencyList = [];

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

    function addAudit() {
        if (usedAgencyAcronyms.size >= agencyAcronyms.length) return;
        const acronym = agencyAcronyms.find(a => !usedAgencyAcronyms.has(a));
        usedAgencyAcronyms.add(acronym);
        agencyList.push(acronym); // Use only acronyms, not full names
        updateUIText();
    }

    function addDemocrat() {
        if (usedDemocratNames.size >= democratNames.length) {
            console.warn('No more unique Democrat names available.');
            return; // Prevent freezing if no names left
        }
        let name;
        let attempts = 0;
        const maxAttempts = 10; // Prevent infinite loop
        do {
            name = democratNames[Math.floor(Math.random() * democratNames.length)]; // Random selection
            attempts++;
            if (attempts > maxAttempts) {
                console.error('Failed to find unique Democrat name after max attempts.');
                return; // Exit to prevent freezing
            }
        } while (usedDemocratNames.has(name));
        usedDemocratNames.add(name);
        democratList.push(name);
        // Check for valid spawn location (not overlapping snake, foods, or other Democrats)
        let validPosition = false;
        let newDemocrat;
        attempts = 0;
        do {
            newDemocrat = {
                x: Math.floor(Math.random() * tileCountX),
                y: Math.floor(Math.random() * tileCountY),
                name
            };
            validPosition = !snake.some(segment => segment.x === newDemocrat.x && segment.y === newDemocrat.y) &&
                           !foods.some(food => food.x === newDemocrat.x && food.y === newDemocrat.y) &&
                           !democrats.some(d => d.x === newDemocrat.x && d.y === newDemocrat.y);
            attempts++;
            if (attempts > maxAttempts) {
                console.warn('Could not find valid position for Democrat, skipping spawn.');
                return; // Skip spawn to prevent freezing
            }
        } while (!validPosition);
        democrats.push(newDemocrat);
        updateUIText();
    }

    function updateUIText() {
        democratsText.innerHTML = `Democrats Against you:\n${democratList.join('\n') || ''}`; // Empty if no Democrats
        agenciesText.innerHTML = `Federal Agencies to Audit:\n${agencyList.join('\n') || ''}`; // Empty if no Agencies
    }

    function drawGame() {
        if (!gameActive) return;

        try {
            // Move snake
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };
            snake.unshift(head);

            // Check food collisions
            let foodEaten = false;
            for (let i = 0; i < foods.length; i++) {
                if (head.x === foods[i].x && head.y === foods[i].y) {
                    if (foods[i].type === 'audit') {
                        score += 30;
                        for (let j = 0; j < 3; j++) snake.push({ ...snake[snake.length - 1] });
                        addAudit();
                    } else if (foods[i].type === 'team') {
                        score += 10;
                        snake.push({ ...snake[snake.length - 1] });
                    }
                    foods.splice(i, 1);
                    foods.push({
                        x: Math.floor(Math.random() * tileCountX),
                        y: Math.floor(Math.random() * tileCountY),
                        type: Math.random() < 0.5 ? 'audit' : 'team',
                        acronym: foods[i].type === 'audit' ? agencyList[agencyList.length - 1] : null // Assign unique acronym to new Audit
                    });
                    foodEaten = true;
                    // Ensure a new Democrat appears every time food is eaten
                    addDemocrat();
                    break;
                }
            }
            if (!foodEaten) snake.pop();

            // Check for overlap with existing Democrats or foods to prevent freezing
            if (democrats.some(d => d.x === head.x && d.y === head.y) || 
                foods.some(f => f.x === head.x && f.y === head.y && f !== foods[foods.length - 1])) {
                gameOver();
                return;
            }

            // Check collisions
            if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
                gameOver();
                return;
            }
            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    gameOver();
                    return;
                }
            }
            for (let i = 0; i < democrats.length; i++) {
                if (head.x === democrats[i].x && head.y === democrats[i].y) {
                    gameOver();
                    return;
                }
            }

            // Draw everything
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Snake (lime green) with "D.O.G.E" label
            ctx.fillStyle = 'lime';
            snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2));
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText('D.O.G.E', snake[0].x * gridSize, snake[0].y * gridSize - 5);

            // Foods (red Audits, green Team Members)
            foods.forEach(food => {
                ctx.fillStyle = food.type === 'audit' ? 'red' : 'green';
                ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
                if (food.type === 'audit' && food.acronym) {
                    // Use the acronym assigned to this specific food object
                    ctx.fillStyle = 'white';
                    ctx.font = '10px Arial';
                    const textX = food.x * gridSize + (gridSize - ctx.measureText(food.acronym).width) / 2;
                    ctx.fillText(food.acronym, textX, food.y * gridSize + gridSize + 10);
                }
            });

            // Democrats (blue blocks)
            democrats.forEach(democrat => {
                ctx.fillStyle = 'blue';
                ctx.fillRect(democrat.x * gridSize, democrat.y * gridSize, gridSize - 2, gridSize - 2);
                ctx.fillStyle = 'white';
                ctx.font = '10px Arial';
                const textX = democrat.x * gridSize + (gridSize - ctx.measureText(democrat.name).width) / 2;
                ctx.fillText(democrat.name, textX, democrat.y * gridSize + gridSize + 10);
            });

            // Update score
            scoreText.textContent = `Score: ${score}`;

            setTimeout(drawGame, gameSpeed);
        } catch (error) {
            console.error('Error in drawGame:', error);
            gameOver(); // Force game over if an error occurs to prevent freezing
        }
    }

    function gameOver() {
        gameActive = false;
        restartText.style.display = 'block';
    }

    function restartGame() {
        snake = [{ x: 20, y: 12 }];
        foods = [
            { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: Math.random() < 0.5 ? 'audit' : 'team' },
            { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: Math.random() < 0.5 ? 'audit' : 'team' },
            { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: Math.random() < 0.5 ? 'audit' : 'team' }
        ];
        democrats = []; // No Democrats at start
        dx = 0;
        dy = 0;
        score = 0;
        gameActive = true;
        usedDemocratNames.clear();
        usedAgencyAcronyms.clear();
        democratList = [];
        agencyList = [];
        updateUIText();
        restartText.style.display = 'none';
        drawGame();
    }

    // Start the game
    drawGame();
});
