// Сетка, реагирующая на мышь
const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = { x: 0, y: 0 };
let cells = [];
const cellSize = 40;

// Создаём сетку
function createGrid() {
    cells = [];
    const cols = Math.ceil(canvas.width / cellSize) + 2;
    const rows = Math.ceil(canvas.height / cellSize) + 2;

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            cells.push({
                x: i * cellSize,
                y: j * cellSize,
                originalX: i * cellSize,
                originalY: j * cellSize,
                size: 1
            });
        }
    }
}

// Отрисовка сетки
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    cells.forEach(cell => {
        const dx = mouse.x - cell.x;
        const dy = mouse.y - cell.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Эффект "отталкивания" клеток от курсора
        if (distance < 150) {
            const force = (150 - distance) / 150;
            const angle = Math.atan2(dy, dx);
            cell.x = cell.originalX + Math.cos(angle) * force * 30;
            cell.y = cell.originalY + Math.sin(angle) * force * 30;
        } else {
            // Плавное возвращение в исходное положение
            cell.x += (cell.originalX - cell.x) * 0.1;
            cell.y += (cell.originalY - cell.y) * 0.1;
        }

        // Рисуем клетку
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, cell.size, 0, Math.PI * 2);
        ctx.stroke();
    });

    // Соединяем близкие клетки линиями
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < cells.length; i++) {
        for (let j = i + 1; j < cells.length; j++) {
            const cellA = cells[i];
            const cellB = cells[j];
            const dx = cellA.x - cellB.x;
            const dy = cellA.y - cellB.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
                ctx.beginPath();
                ctx.moveTo(cellA.x, cellA.y);
                ctx.lineTo(cellB.x, cellB.y);
                ctx.stroke();
            }
        }
    }
}

// Обновление счётчика
function updateCountdown() {
    const targetDate = new Date('July 11, 2025 00:00:00').getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerHTML = `
        <span>${days}</span> дней 
        <span>${hours}</span> часов 
        <span>${minutes}</span> минут 
        <span>${seconds}</span> секунд
    `;
}

// Обработка движения мыши
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Реакция на изменение размера окна
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createGrid();
});

// Запуск
createGrid();
setInterval(updateCountdown, 1000);
updateCountdown();

function animate() {
    drawGrid();
    requestAnimationFrame(animate);
}
animate();