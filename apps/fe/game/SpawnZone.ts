import { Blob } from "./Blob";
import generateRandomColor, { clamp, lerp } from "./utils";

const spawnedZones = new Set<string>();
const CHUNK_SIZE = 200; // Size of zones to spawn blobs in

export function spawnBlobsNearPlayer(CANVAS_WIDTH: number, CANVAS_HEIGHT: number, Player: Blob, blobs: Blob[]) {
    const SPAWN_RADIUS = Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) * clamp(Player.targetR / Player.r, 1, 1.2);
    const centerX = Player.x;
    const centerY = Player.y;
    
    // const growthRatio = (Player.r / Player.targetR) * 0.80
    const randomFoodRadius = () => {
        const scale = clamp(Player.r / 120, 0, 1);
        const smallFood = lerp(6, Math.cbrt(Player.r), scale);
        const mediumFood = lerp(12, 24, scale);
        const largeFood = lerp(24, 48, scale);
        const enemies = Player.r * 1.5
        
        const spawnProbability = clamp(1 - (Player.r - 12) / 148, 0.05, 1); //Probablity of a ANY food spawn  
        console.log('spawnProbaility: ', spawnProbability)
        if (Math.random() > spawnProbability) {
            return undefined; // Skip spawning
        }  
        // If food spawn, probablity of it being a small food >>> medium >> large
        const foodSizeProbablity = Math.random()
        if(foodSizeProbablity <= 0.8){
            return smallFood
        } else if (foodSizeProbablity < 0.9){
            return mediumFood
        } else if (foodSizeProbablity <= 0.95){
            return largeFood 
        } else {
            return enemies
        }
        
    }
    

    const startX = Math.floor((centerX - SPAWN_RADIUS) / CHUNK_SIZE);
    const endX = Math.floor((centerX + SPAWN_RADIUS) / CHUNK_SIZE);
    const startY = Math.floor((centerY - SPAWN_RADIUS) / CHUNK_SIZE);
    const endY = Math.floor((centerY + SPAWN_RADIUS) / CHUNK_SIZE);

    for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
            const zoneKey = `${x},${y}`;
            if (!spawnedZones.has(zoneKey)) {
                spawnedZones.add(zoneKey);

                // Spawn random blobs in this zone
                const blobCount = Math.floor(Math.random() * 3) + 1; // 1–3 blobs
                for (let i = 0; i < blobCount; i++) {
                    const blobX = x * CHUNK_SIZE + Math.random() * CHUNK_SIZE;
                    const blobY = y * CHUNK_SIZE + Math.random() * CHUNK_SIZE;
                    const foodRadius = randomFoodRadius()
                    if(!foodRadius) return;
                    blobs.push(new Blob(foodRadius, generateRandomColor(), blobX, blobY));
                }
            }
        }
    }
} 