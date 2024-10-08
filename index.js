const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
const cols = 20;  // Number of columns
const rows = 20;  // Number of rows
const cellSize = 25; // Size of each cell

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

// Create a 2D array to hold the cells
let grid = [];
let stack = [];

// Cell constructor
function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.visited = false;

    this.walls = {
        top: true,
        right: true,
        bottom: true,
        left: true
    };

    this.checkNeighbors = function() {
        let neighbors = [];

        let top    = grid[index(x, y - 1)];
        let right  = grid[index(x + 1, y)];
        let bottom = grid[index(x, y + 1)];
        let left   = grid[index(x - 1, y)];

        if (top && !top.visited)    neighbors.push(top);
        if (right && !right.visited)  neighbors.push(right);
        if (bottom && !bottom.visited) neighbors.push(bottom);
        if (left && !left.visited)   neighbors.push(left);

        if (neighbors.length > 0) {
            let r = Math.floor(Math.random() * neighbors.length);
            return neighbors[r];
        } else {
            return undefined;
        }
    };

    this.highlight = function() {
        let x = this.x * cellSize;
        let y = this.y * cellSize;
        ctx.fillStyle = 'purple';
        ctx.fillRect(x, y, cellSize, cellSize);
    };

    this.show = function() {
        let x = this.x * cellSize;
        let y = this.y * cellSize;

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;

        if (this.walls.top)    ctx.strokeRect(x, y, cellSize, 0);
        if (this.walls.right)  ctx.strokeRect(x + cellSize, y, 0, cellSize);
        if (this.walls.bottom) ctx.strokeRect(x, y + cellSize, cellSize, 0);
        if (this.walls.left)   ctx.strokeRect(x, y, 0, cellSize);
        
        if (this.visited) {
            ctx.fillStyle = 'black';
            ctx.fillRect(x, y, cellSize, cellSize);
        }
    };
}

// Convert 2D coordinates to a 1D index
function index(x, y) {
    if (x < 0 || y < 0 || x >= cols || y >= rows) {
        return -1;
    }
    return x + y * cols;
}

// Initialize grid
for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        let cell = new Cell(x, y);
        grid.push(cell);
    }
}

// Start the maze generation
let current = grid[0];
current.visited = true;

function removeWalls(a, b) {
    let x = a.x - b.x;
    if (x === 1) {
        a.walls.left = false;
        b.walls.right = false;
    } else if (x === -1) {
        a.walls.right = false;
        b.walls.left = false;
    }

    let y = a.y - b.y;
    if (y === 1) {
        a.walls.top = false;
        b.walls.bottom = false;
    } else if (y === -1) {
        a.walls.bottom = false;
        b.walls.top = false;
    }
}

// Maze generation loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    grid.forEach(cell => cell.show());

    current.highlight();

    let next = current.checkNeighbors();
    if (next) {
        next.visited = true;

        stack.push(current);

        removeWalls(current, next);

        current = next;
    } else if (stack.length > 0) {
        current = stack.pop();
    }

    if (stack.length > 0) {
        requestAnimationFrame(draw);
    }
}

// Start the drawing process
draw();