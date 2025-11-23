export function randomHsl() {
    return `hsl(${Math.floor(Math.random() * 360)} 70% 75%)`;
}

export function makeId(prefix = 'sh') {
    return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function randomColor() {
    const h = rand(0, 360);
    return `hsl(${h}, 70%, 55%)`;
}
export function fitInside(boardWidth, boardHeight, size) {
    const x = rand(8, Math.max(8, boardWidth - size - 8));
    const y = rand(8, Math.max(8, boardHeight - size - 8));
    return { x, y };
}