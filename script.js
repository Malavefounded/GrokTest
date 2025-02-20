// Wait for the DOM to be fully loaded before running the game
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const restartText = document.getElementById('restartText');
    const rulesText = document.getElementById('rulesText');
    const democratsText = document.getElementById('democratsText'); // Reference to Democrats div
    const agenciesText = document.getElementById('agenciesText'); // Reference to Agencies div

    if (!canvas || !ctx || !restartText || !rulesText || !democratsText || !agenciesText) {
        console.error('One or more DOM elements not found. Check your HTML.');
        return;
    }

    const gridSize = 20;
    const tileCountX = canvas.width / gridSize;  // 800 / 20 = 40 tiles wide
    const tileCountY = canvas.height / gridSize; // 500 / 20 = 25 tiles tall

    let snake = [{ x: 20, y: 12 }]; // Start snake more centrally in wider space
    let foods = [
        { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: Math.random() < 0.5 ? 'audit' : 'team' },
        { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: Math.random() < 0.5 ? 'audit' : 'team' },
        { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: Math.random() < 0.5 ? 'audit' : 'team' }
    ];
    let democrats = []; // Array to store Democrat blocks (bad - causes instant death) with associated names
    let audits = []; // Array to store Audit blocks (Federal Agencies) with associated acronyms
    let dx = 0, dy = 0; // Direction for snake movement
    let score = 0, gameSpeed = 100, gameActive = true; // Revert to original gameSpeed of 100ms

    // Good food types: Audits (red, +3 size, +30 points) and Team Members (green, +1 size, +10 points)
    // Bad blocks: Democrats (blue, instant death on contact)
    const democratNames = [
        "Kamala Harris", "Joe Biden", "Chuck Schumer", "Hakeem Jeffries", "Elizabeth Warren",
        "Bernie Sanders", "Brian Schatz", "Patty Murray", "Ron Wyden", "Maxine Waters",
        "Alexandria Ocasio-Cortez", "Pramila Jayapal", "Ilhan Omar", "Greg Casar", "Jamie Raskin",
        "Ro Khanna", "Melanie Stansbury", "Maxwell Alejandro Frost", "Becca Balint", "Chris Murphy",
        "Lisa Blunt Rochester", "Jared Golden", "Gerry Connolly", "Don Beyer", "Scott Peters",
        "Tammy Baldwin", "Michael Bennet", "Cory Booker", "Chris Coons", "Tammy Duckworth",
        "Anthony Fauci", "Francis Collins", "Bill Gates", "Clifford Lane", "Hillary Clinton", "Barack Obama"
    ];
    let usedDemocratNames = new Set(); // Track used Democrat names to prevent duplicates
    let democratList = []; // Track all Democrat names that have appeared

    const agencyAcronyms = [
        "USAID", "CFPB", "EPA", "Treasury", "DOD", "IRS", "DOE", "SSA", "FEMA", "USPS",
        "HUD", "GSA", "STATE", "SBA", "DOI", "NPS", "OMB", "ED", "OPM", "DOJ",
        "NASA", "VA", "USDA", "FAA", "DOT", "CDC", "NIH", "FDA", "DEA", "SEC"
    ];
    const agencyFullNames = [
        "U.S. Agency for International Development", "Consumer Financial Protection Bureau", "Environmental Protection Agency", 
        "U.S. Department of the Treasury", "Department of Defense", "Internal Revenue Service", "Department of Energy", 
        "Social Security Administration", "Federal Emergency Management Agency", "United States Postal Service",
        "Department of Housing and Urban Development", "General Services Administration", "Department of State", 
        "Small Business Administration", "Department of the Interior", "National Park Service", "Office of Management and Budget", 
        "Department of Education", "Office of Personnel Management", "Department of Justice",
        "National Aeronautics and Space Administration", "Department of Veterans Affairs", "U.S. Department of Agriculture", 
        "Federal Aviation Administration", "Department of Transportation", "Centers for Disease Control and Prevention", 
        "National Institutes of Health", "Food and Drug Administration", "Drug Enforcement Administration", "Securities and Exchange Commission"
    ];
    let usedAgencyAcronyms = new Set(); // Track used agency acronyms to prevent duplicates
    let agencyList = []; // Track all agency acronyms that have appeared

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

    function drawGame() {
        // Move snake
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        // Check if snake ate any good food (Audits or Team Members) or hit a Democrat
        let foodEaten = false;
        for (let i = 0; i < foods.length; i++) {
            if (head.x === foods[i].x && head.y === foods[i].y) {
                // Good food consumption: Increases size and score
                if (foods[i].type === 'audit') { // Red Audits (Federal Agencies, good)
                    score += 30; // Higher score for Audits
                    for (let j = 0; j < 3; j++) {
                        snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
                    }
                    // Add new Audit block with unique acronym
                    addAudit();
                } else if (foods[i].type === 'team') { // Green Team Members (good)
                    score += 10; // Lower score for Team Members
                    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
                }
                foods.splice(i, 1);
                foods.push({
                    x: Math.floor(Math.random() * tileCountX),
                    y: Math.floor(Math.random() * tileCountY),
                    type: Math.random() < 0.5 ? 'audit' : 'team'
                });
                foodEaten = true;
                break;
            }
        }

        if (!foodEaten) snake.pop();

        // Check collisions with walls and self
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

        // Check collisions with Democrats (blue blocks)
        for (let i = 0; i < democrats.length; i++) {
            if (head.x === democrats[i].x && head.y === democrats[i].y) {
                gameOver();
                return;
            }
        }

        // Draw everything, with strict and isolated color management to ensure blue Democrats and red Audits
        ctx.fillStyle = 'black'; // Reset background to black explicitly
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'lime'; // Ensure snake is lime green
        snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2));

        // Draw good foods (Audits and Team Members)
        foods.forEach(food => {
            ctx.fillStyle = food.type === 'audit' ? 'red' : 'green'; // Red Audits, Green Team Members (good)
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
            if (food.type === 'audit' && food.acronym) { // Ensure acronym exists to avoid "undefined"
                // Draw Audit acronym under the red block in small, legible white text
                ctx.fillStyle = 'white'; // Acronyms in white for contrast against red blocks
                ctx.font = '10px Arial'; // Small but legible text
                const acronym = food.acronym;
                const acronymWidth = ctx.measureText(acronym).width;
                const acronymX = food.x * gridSize + (gridSize - acronymWidth) / 2; // Center the acronym under the block
                const acronymY = food.y * gridSize + gridSize + 12; // Position below the block with slight offset
                ctx.fillText(acronym, acronymX, acronymY); // Draw only text, no rectangle
            }
        });

        // Draw bad Democrats blocks (blue, instant death) with names underneath in white
        ctx.save(); // Save the current context state
        ctx.fillStyle = 'blue'; // Forcefully set blue for all Democrat blocks, isolated from other styles
        democrats.forEach(democrat => {
            ctx.fillRect(democrat.x * gridSize, democrat.y * gridSize, gridSize - 2, gridSize - 2); // Draw blue block
            // Draw Democrat name under the block in small, legible white text
            ctx.fillStyle = 'white'; // Names in white for contrast against blue blocks
            ctx.font = '10px Arial'; // Small but legible text
            const name = democrat.name;
            const nameWidth = ctx.measureText(name).width;
            const nameX = democrat.x * gridSize + (gridSize - nameWidth) / 2; // Center the name under the block
            const nameY = democrat.y * gridSize + gridSize + 12; // Position below the block with slight offset
            ctx.fillText(name, nameX, nameY); // Draw only text, no rectangle
        });
        ctx.restore(); // Restore context state after drawing Democrats

        // Update "Democrats Against you" text in the HTML div (always visible, updated with all Democrat names vertically)
        if (democrats.length > 0) {
            democratList = [...new Set(democrats.map(d => d.name))]; // Track all unique Democrat names that have appeared
            const nameList = democratList.map(name => name).join('\n'); // Join names with newlines for vertical listing
            democratsText.textContent = `Democrats Against you:\n${nameList}`; // Always show the list of names vertically
        } else {
            democratsText.textContent = 'Democrats Against you:'; // Show only "Democrats Against you:" if no Democrats exist
        }

        // Update "Federal Agencies to Audit" text in the HTML div (always visible, updated with all agency full names vertically)
        if (audits.length > 0) {
            agencyList = [...new Set(audits.map(a => a.acronym))]; // Track all unique agency acronyms that have appeared
            const fullNameList = agencyList.map(acronym => {
                const index = agencyAcronyms.indexOf(acronym);
                if (index !== -1) return agencyFullNames[index]; // Map acronym to full name, ensure index exists
                return acronym; // Fallback in case of error
            }).join('\n'); // Join full names with newlines for vertical listing
            agenciesText.textContent = `Federal Agencies to Audit:\n${fullNameList}`; // Always show the list of full names vertically
        } else {
            agenciesText.textContent = 'Federal Agencies to Audit:'; // Show only "Federal Agencies to Audit:" if no Audits exist
        }

        // Draw "D.O.G.E" above the snake's head
        ctx.fillStyle = 'white';
        ctx.font = '15px Arial';
        const nameWidth = ctx.measureText('D.O.G.E').width;
        const nameX = snake[0].x * gridSize + (gridSize - nameWidth) / 2;
        const nameY = snake[0].y * gridSize - 5;
        ctx.fillText('D.O.G.E', nameX, nameY);

        // Draw score
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 30);

        // Use setTimeout to control speed (revert to original behavior, 100ms per move)
        setTimeout(drawGame, gameSpeed);
    }

    function gameOver() {
        gameActive = false;
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        const gameOverWidth = ctx.measureText('Game Over!').width;
        const scoreWidth = ctx.measureText(`Score: ${score}`).width;
        ctx.fillText('Game Over!', (canvas.width - gameOverWidth) / 2, canvas.height / 2 - 20);
        ctx.fillText(`Score: ${score}`, (canvas.width - scoreWidth) / 2, canvas.height / 2 + 20);
        restartText.style.display = 'block'; // Show restart text
    }

    function restartGame() {
        snake = [{ x: 20, y: 12 }];
        foods = [
            { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: Math.random() < 0.5 ? 'audit' : 'team' },
            { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random
