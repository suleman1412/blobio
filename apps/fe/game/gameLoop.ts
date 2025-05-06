import { BlobType, GameMessage, UserState } from "@repo/common/schema";
import { GameState } from "./gameState";
import { clamp, exponentialDecay, lerp } from "./utils";
import { drawGrid } from "./drawGrid";
import { spawnBlobsNearPlayer } from "./SpawnZone";
import { Blob } from "./Blob";
import { useGameStore } from "@/store/store";

export default function gameLoop(state: any) {
    const { ctx, mouseCoords, cameraCoords, CANVAS_WIDTH, CANVAS_HEIGHT, clientWS, } = state;
    let { currentZoom, gameRunning } = state

    const { selfBlob, clientPlayers, clientBlobs, setGameState } = useGameStore.getState()
    if (!selfBlob) return;

    const MAX_DISTANCE = Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) * clamp(selfBlob.targetR / selfBlob.r, 1.2, 2);
    if (!ctx) return;
    ctx.save();



    // console.log('[gameloop]clientsideBlobs:', clientBlobs)
    console.log('[gameloop]clientsidePlayers:', clientPlayers)

    // Calculate world position for mouse
    const worldMouseCoords = { x: mouseCoords.x + cameraCoords.x, y: mouseCoords.y + cameraCoords.y }
    // const worldMouseY = mouseCoords.y + cameraCoords.y;

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
        // console.log('current zoom and zoom factor not equal: ', currentZoom, zoomFactor)
        currentZoom = lerp(currentZoom, zoomFactor, 0.01);
    }

    ctx.scale(currentZoom, currentZoom)
    ctx.translate(-selfBlob.pos.x, -selfBlob.pos.y)

    drawGrid(ctx, selfBlob, CANVAS_WIDTH, CANVAS_HEIGHT, currentZoom)

    // console.log('[gameLoop.ts] blobs: ', blobs)
    // spawnBlobsNearPlayer(CANVAS_WIDTH, CANVAS_HEIGHT, Player, blobs)

    for (let i = clientBlobs.length - 1; i >= 0; i--) {
        const dx = selfBlob.pos.x - clientBlobs[i].pos.x;
        const dy = selfBlob.pos.y - clientBlobs[i].pos.y;
        const distSq = dx ** 2 + dy ** 2;
        clientBlobs[i].draw(ctx);
        const eatCondition = selfBlob.eats(clientBlobs[i], clientWS)
        if (eatCondition) {
            clientBlobs.splice(i, 1);
            // spawnBlobsNearPlayer(CANVAS_WIDTH, CANVAS_HEIGHT, Player, blobs)
        } else if (eatCondition === 0) {
            alert('Game End')
            state.gameRunning = false
        }

        if (distSq > MAX_DISTANCE ** 2) {
            clientBlobs.splice(i, 1);
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
                    clientPlayers: updatedPlayers
                })
            } else if (eatCondition === 0) {
                alert('Game End')
                state.gameRunning = false
            }
        }
    }
    // for (const [uuid, player] of clientPlayers) {
    //     if (player.userId !== selfBlob.userId) {
    //         player.draw(ctx);
    //         const eatCondition = selfBlob.eats(player, clientWS); 
    
    //         if (eatCondition) {
    //             clientPlayers.delete(uuid);
    //         } else if (eatCondition === 0) {
    //             alert('Game End');
    //             state.gameRunning = false;
    //         }
    //     }
    // }
    
    selfBlob.draw(ctx);
    ctx.restore();
}