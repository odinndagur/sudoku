var canvas = document.createElement('canvas');
var appRoot = document.getElementById('app');
appRoot === null || appRoot === void 0 ? void 0 : appRoot.appendChild(canvas);
var SIZE = 600;
canvas.width = SIZE;
canvas.height = SIZE;
var ctx = canvas.getContext('2d');
var sudokuNumbers = [
    0, 0, 0, 2, 6, 0, 7, 0, 1,
    6, 8, 0, 0, 7, 0, 0, 9, 0,
    1, 9, 0, 0, 0, 4, 5, 0, 0,
    8, 2, 0, 1, 0, 0, 0, 4, 0,
    0, 0, 4, 6, 0, 2, 9, 0, 0,
    0, 5, 0, 0, 0, 3, 0, 2, 8,
    0, 0, 9, 3, 0, 0, 0, 7, 4,
    0, 4, 0, 0, 5, 0, 0, 3, 6,
    7, 0, 3, 0, 1, 8, 0, 0, 0
];
function mapf(val, inMin, inMax, outMin, outMax) {
    return outMin + ((val - inMin) / (inMax - inMin) * (outMax));
}
var clamp = function (val, min, max) {
    if (val < min) {
        return min;
    }
    if (val > max) {
        return max;
    }
    return val;
};
var Cell = /** @class */ (function () {
    function Cell() {
        this.selected = false;
        this.locked = false;
        // row: number
        // column: number
    }
    return Cell;
}());
var Grid = /** @class */ (function () {
    function Grid() {
        this.cells = [];
        this.isSelecting = false;
        this.isUnselecting = false;
    }
    return Grid;
}());
var grid = new Grid();
for (var idx = 0; idx < 9 * 9; idx++) {
    var c = new Cell();
    if (Math.random() > 0.5) {
        c.value = Math.floor((Math.random() * 9) + 1);
    }
    c.value = sudokuNumbers[idx];
    if (c.value) {
        c.locked = true;
    }
    grid.cells.push(c);
}
var renderGrid = function () {
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.lineWidth = 1;
    for (var y = 0; y < 9; y++) {
        for (var x = 0; x < 9; x++) {
            var xPos = mapf(x, 0, 9, 0, SIZE);
            var yPos = mapf(y, 0, 9, 0, SIZE);
            var cell = grid.cells[y * 9 + x];
            ctx.fillStyle = cell.selected ? 'red' : cell.fillColor ? cell.fillColor : 'white';
            ctx.fillRect(xPos, yPos, SIZE / 9, SIZE / 9);
            ctx.strokeRect(xPos, yPos, SIZE / 9, SIZE / 9);
            ctx.fillStyle = 'black';
            ctx.font = "50px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(cell.value || ""), xPos + SIZE / 18, yPos + SIZE / 18);
            if (!cell.value) {
                ctx.font = "20px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(String(cell.cornerPencil || ""), xPos + 15, yPos + 15);
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(String(cell.centerPencil || ""), xPos + SIZE / 18, yPos + SIZE / 18);
            }
        }
    }
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, SIZE - 3, SIZE - 3);
    for (var off = 1; off < 3; off++) {
        var offPos = mapf(off, 0, 3, 0, SIZE);
        ctx.beginPath();
        ctx.moveTo(0, offPos);
        ctx.lineTo(SIZE, offPos);
        ctx.moveTo(offPos, 0);
        ctx.lineTo(offPos, SIZE);
        ctx.stroke();
        ctx.closePath();
    }
};
document.addEventListener('mousedown', function (ev) {
    var canvasRect = canvas.getBoundingClientRect();
    var mouseX = ev.clientX - canvasRect.left;
    var mouseY = ev.clientY - canvasRect.top;
    var row = clamp(Math.floor(mapf(mouseY, 0, SIZE, 0, 9)), 0, 8);
    var col = clamp(Math.floor(mapf(mouseX, 0, SIZE, 0, 9)), 0, 8);
    console.log({ mouseX: mouseX, mouseY: mouseY, row: row, col: col });
    var cell = grid.cells[row * 9 + col];
    grid.isSelecting = !cell.selected;
    grid.isUnselecting = cell.selected;
    // cell.selected = !cell.selected
    if (!cell.selected && !ev.shiftKey) {
        grid.cells.forEach(function (c) {
            c.selected = false;
        });
        cell.selected = true;
    }
    else {
        cell.selected = !cell.selected;
    }
    // grid.cells[row * 9 + col].selected = !grid.cells[row * 9 + col].selected
    // grid.isSelecting = true
    renderGrid();
});
document.addEventListener('mouseup', function (ev) {
    grid.isSelecting = false;
    grid.isUnselecting = false;
});
document.addEventListener('mousemove', function (ev) {
    if (grid.isSelecting || grid.isUnselecting) {
        var canvasRect = canvas.getBoundingClientRect();
        var mouseX = ev.clientX - canvasRect.left;
        var mouseY = ev.clientY - canvasRect.top;
        var row = clamp(Math.floor(mapf(mouseY, 0, SIZE, 0, 9)), 0, 8);
        var col = clamp(Math.floor(mapf(mouseX, 0, SIZE, 0, 9)), 0, 8);
        console.log({ mouseX: mouseX, mouseY: mouseY, row: row, col: col });
        var cell = grid.cells[row * 9 + col];
        cell.selected = grid.isSelecting ? true : grid.isUnselecting ? false : cell.selected;
        renderGrid();
    }
});
// document.addEventListener('mouseup', (ev) => {
//     const canvasRect = canvas.getBoundingClientRect()
//     const mouseX = ev.clientX - canvasRect.left
//     const mouseY = ev.clientY - canvasRect.top
//     const row = Math.floor(mapf(mouseY, 0, SIZE, 0, 9))
//     const col = Math.floor(mapf(mouseX, 0, SIZE, 0, 9))
//     console.log({mouseX,mouseY,row,col})
//     grid.cells[row * 9 + col].selected = !grid.cells[row * 9 + col].selected
//     renderGrid()
// })
document.addEventListener('keydown', function (ev) {
    if (ev.keyCode >= 48 && ev.keyCode <= 57) {
        console.log(ev);
        grid.cells.forEach(function (cell) {
            if (cell.selected && !cell.locked) {
                if (ev.altKey) {
                    cell.centerPencil = Number(ev.keyCode - 48);
                }
                else if (ev.ctrlKey) {
                    cell.cornerPencil = Number(ev.keyCode - 48);
                }
                else if (cell.value == Number(ev.key)) {
                    cell.value = undefined;
                }
                else {
                    cell.value = Number(ev.key);
                }
            }
        });
    }
    renderGrid();
});
renderGrid();
