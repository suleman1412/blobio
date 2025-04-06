export default function generateRandomColor(){
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function lerp(num1: number, num2: number){
    return Math.abs((num1 - num2) * 0.02)
}