body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: black; /* Changed to black for the entire page */
}

.game-container {
    position: relative;
    background-color: black; /* Ensure container background is black */
}

#rulesText {
    position: absolute;
    top: -100px; /* Move further up to ensure it’s above the playable area */
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-family: Arial, sans-serif;
    font-size: 16px; /* Maintain readability */
    text-align: center;
    width: 800px; /* Match canvas width for centering */
    white-space: normal; /* Allow text to wrap if needed */
    line-height: 1.5; /* Maintain line spacing for readability */
    overflow: hidden; /* Hide any overflow */
}

#restartText {
    position: absolute;
    top: -30px; /* Position above the canvas */
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-family: Arial, sans-serif;
    font-size: 16px;
    display: none; /* Hidden by default, shown only on game over */
}

#gameCanvas {
    border: 2px solid white; /* White border around the game field */
}
