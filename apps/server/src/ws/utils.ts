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