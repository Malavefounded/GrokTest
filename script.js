// Wait for the DOM to be fully loaded before running the game
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d'); // Revert to default context (no alpha: false for simplicity)
    const restartText = document.getElementById('restartText');
    const rulesText = document.getElementById('rulesText');

    if (!canvas || !ctx || !restartText || !rulesText) {
        console.error('One or more DOM elements not found. Check your HTML.');
        return;
    }

    const gridSize = 20;
    const tileCountX = canvas.width / gridSize;  // 800 / 20 = 40 tiles wide
    const tileCountY = canvas.height / gridSize; // 500 / 20 = 25 tiles tall

    let snake = [{ x: 20, y: 12 }]; // Start snake more
