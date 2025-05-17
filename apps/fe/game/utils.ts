
export function lerp(num1: number, num2: number, factor: number = 0.02) {
    return num1 + (num2 - num1) * factor
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

export function exponentialDecay(A: number, k: number, x: number, C: number) {
    return A * Math.exp(-k * x) + C;
}

export function distance(V1: { x: number, y: number }, V2: { x: number, y: number }) {
    return Math.sqrt((V2.x - V1.x) ** 2 + (V2.y - V1.y) ** 2)
}

export function createVector(x: number, y: number) {
    return { x, y };
}

export function setMag(vector: { x: number, y: number }, magnitude: number) {
    const current = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    if (current === 0) return vector;

    const scale = magnitude / current;
    return { x: vector.x * scale, y: vector.y * scale };
}