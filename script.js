// Initialize the canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const auditedPanel = document.getElementById('auditedPanel');
const teamMembersPanel = document.getElementById('teamMembersPanel');

// Game settings
const WIDTH = 800;
const HEIGHT = 600;
const FOOD_SIZE = 10; // Reduced food size for smaller canvas
const TEAM_MEMBER_POINTS = 5;
const AGENCY_POINTS = 10;
const FPS = 120; // Increased FPS significantly to make snake much faster

let snakePos = [WIDTH / 2, HEIGHT / 2];
let snakeBody = [[WIDTH / 2, HEIGHT / 2]];
let direction = '
