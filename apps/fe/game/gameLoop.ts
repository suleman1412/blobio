import { clamp, exponentialDecay, lerp } from "./utils";
import { drawGrid } from "./drawGrid";
import { useGameStore } from "@/store/store";
import { GameState } from '@repo/common/schema'

export default function gameLoop(state: GameState) {
    const { ctx, mouseCoords, cameraCoords, CANVAS_WIDTH, CANVAS_HEIGHT, clientWS, } = state;
    let { currentZoom } = state

    const { selfBlob, clientPlayers, clientBlobs, setGameState } = useGameStore.getState()
    if (!selfBlob) return;

    const MAX_DISTANCE = Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) * clamp(selfBlob.targetR / selfBlob.r, 1.2, 2);
    if (!ctx) return;
    ctx.save();

    // Calculate world position for mouse
    const worldMouseCoords = { x: mouseCoords.x + cameraCoords.x, y: mouseCoords.y + cameraCoords.y }

    // Calculate zoom target based on size AND growth
    const zoomFactor = exponentialDecay(3.32, 0.1, selfBlob.r, 1);

    // Update player with world-space mouse coordinates
    selfBlob.setNewCoords(worldMouseCoords, clientWS);

    // Update world offset based on player position
    cameraCoords.x = selfBlob.pos.x - CANVAS_WIDTH / 2;
    cameraCoords.y = selfBlob.pos.y - CANVAS_HEIGHT / 2;

    // Clear and prepare for drawing
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // To 
    ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)


    if (Math.abs(currentZoom - zoomFactor) < 0.001) {
        currentZoom = zoomFactor;
    } else {
        currentZoom = lerp(currentZoom, zoomFactor, 0.01);
    }

    ctx.scale(currentZoom, currentZoom)
    ctx.translate(-selfBlob.pos.x, -selfBlob.pos.y)

    drawGrid(ctx, selfBlob, CANVAS_WIDTH, CANVAS_HEIGHT, currentZoom)


    for (const [id, blob] of clientBlobs) {
        const dx = selfBlob.pos.x - blob.pos.x;
        const dy = selfBlob.pos.y - blob.pos.y;
        const distSq = dx ** 2 + dy ** 2;

        blob.draw(ctx);

        const eatCondition = selfBlob.eats(blob, clientWS);
        const updatedFood = new Map(clientBlobs)
        if (eatCondition) {
            updatedFood.delete(id)
            setGameState({ clientBlobs: updatedFood })
        } else if (eatCondition === 0) {
            setGameState({ hasGameStarted: false})
            // console.log('when the food is bigger')
            break;
        }
        if (distSq > MAX_DISTANCE ** 2) {
            clientBlobs.delete(id);
        }
    }

    for (const [playerId, player] of clientPlayers) {
        if (player.userId !== selfBlob.userId) {
            player.draw(ctx);
            const eatCondition = selfBlob.eats(player, clientWS)
            const updatedPlayers = new Map(clientPlayers)
            updatedPlayers.delete(playerId)
            if(eatCondition){
                setGameState({
                    clientPlayers: updatedPlayers,
                })
                // console.log('player got eaten')
            } 
        }
    }
    
    selfBlob.draw(ctx);
    ctx.restore();
}