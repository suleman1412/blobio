export default function generateRandomColor(){
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function lerp(num1: number, num2: number, factor: number = 0.02){
    return num1 + (num2 - num1) * factor
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

export function exponentialDecay(A: number, k: number, x: number, C: number) {
    return A * Math.exp(-k * x) + C;
}