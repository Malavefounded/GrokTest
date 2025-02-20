// Wait for the DOM to be fully loaded before running the game
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const restartText = document.getElementById('restartText');
    const rulesText = document.getElementById('rulesText');

    if (!canvas || !ctx || !restartText || !rulesText) {
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
        "Tammy Baldwin", "Michael Bennet", "Cory Booker", "Chris Coons", "Tammy Duckworth"
    ];
    let usedNames = new Set(); // Track used names to prevent duplicates

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

        // Check if snake ate any good food (Audits or Team Members)
        let foodEaten = false;
        for (let i = 0; i < foods.length; i++) {
            if (head.x === foods[i].x && head.y === foods[i].y) {
                // Good food consumption: Increases size and score
                if (foods[i].type === 'audit') { // Red Audits (good)
                    score += 30; // Higher score for Audits
                    for (let j = 0; j < 3; j++) {
                        snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
                    }
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
                // After eating good food, add a bad Democrat block with a unique name
                addDemocrat();
                foodEaten = true;
                break;
            }
        }

        if (!foodEaten) snake.pop();

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

        // Draw everything, with strict color management to ensure blue Democrats
        ctx.fillStyle = 'black'; // Reset to black background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'lime'; // Ensure snake is lime green
        snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2));

        // Draw good foods (Audits and Team Members)
        foods.forEach(food => {
            ctx.fillStyle = food.type === 'audit' ? 'red' : 'green'; // Red Audits, Green Team Members (good)
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
        });

        // Draw bad Democrats blocks (blue, instant death) with names underneath in white
        ctx.fillStyle = 'blue'; // Explicitly and forcefully set blue for all Democrat blocks
        democrats.forEach(democrat => {
            ctx.fillRect(democrat.x * gridSize, democrat.y * gridSize, gridSize - 2, gridSize - 2); // Draw blue block
            // Draw Democrat name under the block in small, legible white text
            ctx.fillStyle = 'white'; // Ensure names are white for contrast against blue blocks
            ctx.font = '10px Arial'; // Small but legible text
            const name = democrat.name;
            const nameWidth = ctx.measureText(name).width;
            const nameX = democrat.x * gridSize + (gridSize - nameWidth) / 2; // Center the name under the block
            const nameY = democrat.y * gridSize + gridSize + 12; // Position below the block with slight offset
            ctx.fillText(name, nameX, nameY); // Draw only text, no rectangle
        });

        // Draw "Democrats against you" message and name in bottom-right corner only when a new Democrat appears
        if (democrats.length > 0 && democrats[democrats.length - 1].newlyAdded) {
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial'; // Slightly larger but still small for legibility
            const message = `Democrats against you\n${democrats[democrats.length - 1].name}`;
            const lines = message.split('\n');
            const lineHeight = 14; // Space between lines
            const textX = canvas.width - 10; // Bottom-right corner, slight padding
            const textY = canvas.height - 10 - (lines.length - 1) * lineHeight; // Position at bottom-right, adjusted for multiple lines
            lines.forEach((line, index) => {
                const lineWidth = ctx.measureText(line).width;
                ctx.fillText(line, textX - lineWidth, textY + index * lineHeight);
            });
            // Mark the Democrat as no longer newly added after displaying
            democrats[democrats.length - 1].newlyAdded = false;
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
            { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: Math.random() < 0.5 ? 'audit' : 'team' },
            { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY), type: Math.random() < 0.5 ? 'audit' : 'team' }
        ];
        democrats = []; // Clear bad Democrats blocks on restart
        usedNames.clear(); // Clear used names on restart
        dx = dy = 0; score = 0; gameSpeed = 100; gameActive = true;
        restartText.style.display = 'none'; // Hide restart text
        drawGame(); // Start the game loop with setTimeout
    }

    function addDemocrat() {
        let newDemocrat;
        do {
            newDemocrat = { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY) };
            // Ensure the new bad Democrat block doesn't overlap with the snake, good foods, or other bad Democrats
        } while (snake.some(segment => segment.x === newDemocrat.x && segment.y === newDemocrat.y) ||
                 foods.some(food => food.x === newDemocrat.x && food.y === newDemocrat.y) ||
                 democrats.some(dem => dem.x === newDemocrat.x && dem.y === newDemocrat.y));

        // Select a unique Democrat name (no duplicates at the same time)
        let availableNames = democratNames.filter(name => !usedNames.has(name));
        if (availableNames.length === 0) {
            usedNames.clear(); // Reset if all names are used (though unlikely with 30 names)
            availableNames = democratNames;
        }
        const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
        usedNames.add(randomName);
        newDemocrat.name = randomName;
        newDemocrat.newlyAdded = true; // Mark as newly added for displaying the message
        democrats.push(newDemocrat);
    }

    // Start the game with the original setTimeout-based loop
    drawGame();
});
