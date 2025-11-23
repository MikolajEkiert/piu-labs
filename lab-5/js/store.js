const STORAGE_KEY = 'lab5-shapes-v1';

export default function createStore() {
    const shapes = new Map();
    let nextId = 1;
    return {
        addShape(shape) {
            const id = `shape-${nextId++}`;
            const s = Object.assign({}, shape, { id });
            shapes.set(id, s);
            return s;
        },
        removeShape(id) {
            return shapes.delete(id);
        },
        updateShape(id, patch) {
            if (!shapes.has(id)) return null;
            const s = Object.assign({}, shapes.get(id), patch);
            shapes.set(id, s);
            return s;
        },
        getShapes() {
            return Array.from(shapes.values());
        },
        getShapesByType(type) {
            return Array.from(shapes.values()).filter(s => s.type === type);
        },
        count(type) {
            if (!type) return shapes.size;
            return this.getShapesByType(type).length;
        }
    };
}