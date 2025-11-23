import { randomColor, fitInside } from './helper.js';

export function initUI(store) {
    const board = document.getElementById('board');
    const btnAddSquare = document.getElementById('addSquare');
    const btnAddCircle = document.getElementById('addCircle');
    const btnRecolorSquares = document.getElementById('recolorSquares');
    const btnRecolorCircles = document.getElementById('recolorCircles');
    const cntSquares = document.getElementById('cntSquares');
    const cntCircles = document.getElementById('cntCircles');

    function updateCounters() {
        cntSquares.textContent = store.count('square');
        cntCircles.textContent = store.count('circle');
    }

    function createElementForShape(shape) {
        const el = document.createElement('div');
        el.id = shape.id;
        el.className = `shape ${shape.type}`;
        el.style.width = `${shape.size}px`;
        el.style.height = `${shape.size}px`;
        el.style.left = `${shape.x}px`;
        el.style.top = `${shape.y}px`;
        el.style.backgroundColor = shape.color;
        el.addEventListener('click', () => {
            store.removeShape(shape.id);
            el.remove();
            updateCounters();
        });
        return el;
    }

    function addShape(type) {
        const size = 64;
        const rect = board.getBoundingClientRect();
        const pos = fitInside(Math.floor(rect.width), Math.floor(rect.height), size);
        const color = randomColor();
        const shape = store.addShape({ type, size, x: pos.x, y: pos.y, color });
        const el = createElementForShape(shape);
        board.appendChild(el);
        updateCounters();
    }

    function recolor(type) {
        const list = store.getShapesByType(type);
        list.forEach(s => {
            const color = randomColor();
            store.updateShape(s.id, { color });
            const el = document.getElementById(s.id);
            if (el) el.style.backgroundColor = color;
        });
    }

    btnAddSquare.addEventListener('click', () => addShape('square'));
    btnAddCircle.addEventListener('click', () => addShape('circle'));
    btnRecolorSquares.addEventListener('click', () => recolor('square'));
    btnRecolorCircles.addEventListener('click', () => recolor('circle'));

    updateCounters();
    window.addEventListener('resize', updateCounters);
}