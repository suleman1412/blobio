export function checkWS(req: Request) {
    if (req.headers.get('upgrade') !== 'websocket') {
        return false //not a WS
    }
    return true // a WS
}

export function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
export const randomFoodRadius = () => {
    const foodSizeProbability = Math.random()
    if (foodSizeProbability <= 0.5) {
        return 8
    } else if (foodSizeProbability <= 0.8) {
        return 10
    } else if (foodSizeProbability <= 0.9) {
        return 12
    } else {
        return 48
    }
}