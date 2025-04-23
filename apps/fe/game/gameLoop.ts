import { GameMessage } from "@repo/common/schema";
import { GameState } from "./gameState";
import { clamp, exponentialDecay, lerp } from "./utils";
import { drawGrid } from "./drawGrid";
import { spawnBlobsNearPlayer } from "./SpawnZone";

export default function gameLoop(state: GameState) {
    const { ctx, Player, blobs, mouseCoords, cameraCoords, CANVAS_WIDTH, CANVAS_HEIGHT, clientWS,  } = state;
    let { currentZoom, gameRunning } = state 
    const MAX_DISTANCE = Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) * clamp(Player.targetR / Player.r, 1.2, 2);
    if (!ctx) return;
    ctx.save();

    // Calculate world position for mouse
    const worldMouseCoords = { x: mouseCoords.x + cameraCoords.x, y: mouseCoords.y + cameraCoords.y }
    // const worldMouseY = mouseCoords.y + cameraCoords.y;

    // Calculate zoom target based on size AND growth
    const zoomFactor = exponentialDecay(3.32, 0.1, Player.r, 1);

    // Update player with world-space mouse coordinates
    Player.setNewCoords(worldMouseCoords);

    // SEND PLAYER POSTION
    if(Player.isMoving){
        console.log(Player.isMoving)
        console.log('prev position', Player.prevPos)
        console.log('current position', Player.pos)
        const MOVE_MESSAGE: GameMessage = {
            type: "MOVE",
            data: {
                id: Player.label!,
                x: Player.pos.x,
                y: Player.pos.y
            }
        }
        if (clientWS.readyState === WebSocket.OPEN) {
            clientWS.send(JSON.stringify(MOVE_MESSAGE))
        }
    }

    // Update world offset based on player position
    cameraCoords.x = Player.pos.x - CANVAS_WIDTH / 2;
    cameraCoords.y = Player.pos.y - CANVAS_HEIGHT / 2;

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
    ctx.translate(-Player.pos.x, -Player.pos.y)

    drawGrid(ctx, Player, CANVAS_WIDTH, CANVAS_HEIGHT, currentZoom)

    spawnBlobsNearPlayer(CANVAS_WIDTH, CANVAS_HEIGHT, Player, blobs)

    for (let i = blobs.length - 1; i >= 0; i--) {
        const dx = Player.pos.x - blobs[i].pos.x;
        const dy = Player.pos.y - blobs[i].pos.y;
        const distSq = dx ** 2 + dy ** 2;
        blobs[i].draw(ctx);
        const eatCondition = Player.eats(blobs[i])
        if (eatCondition) {
            blobs.splice(i, 1);
            spawnBlobsNearPlayer(CANVAS_WIDTH, CANVAS_HEIGHT, Player, blobs)
        } else if (eatCondition === 0) {
            gameRunning = false
            alert('Game End')
        }

        if (distSq > MAX_DISTANCE ** 2) {
            blobs.splice(i, 1);
        }
    }

    Player.draw(ctx);
    ctx.restore();
}