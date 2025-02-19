// Canvas setup (full-screen)
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Set canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gridSize = 50; // Size of each hexagon (adjust for visibility on full screen)
const tileCountX = Math.floor(canvas.width / gridSize); // Number of tiles horizontally
const tileCountY = Math.floor(canvas.height / gridSize); // Number of tiles vertically

// Update hexToPixel to work with full-screen dimensions
function hexToPixel(q, r) {
    const x = gridSize * (3/2 * q);
    const y = gridSize * (Math.sqrt(3) * r + Math.sqrt(3)/2 * q);
    return { x: x + canvas.width / 2 - gridSize * 1.5 * (tileCountX / 2), y: y + canvas.height / 2 - gridSize * Math.sqrt(3) * (tileCountY / 2) };
}

// Ensure GRID_SIZE fits the screen (e.g., 7x7 might be too small; adjust if needed)
const GRID_SIZE = Math.min(tileCountX, tileCountY) > 7 ? 7 : Math.floor(Math.min(tileCountX, tileCountY) / 2); // Dynamic grid size

// Add resize handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    tileCountX = Math.floor(canvas.width / gridSize);
    tileCountY = Math.floor(canvas.height / gridSize);
    GRID_SIZE = Math.min(tileCountX, tileCountY) > 7 ? 7 : Math.floor(Math.min(tileCountX, tileCountY) / 2);
    resetRound(); // Reset on resize to fit new dimensions
});
