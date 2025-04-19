import { Blob } from "./Blob"
import { drawGrid } from "./drawGrid";
import { spawnBlobsNearPlayer } from "./SpawnZone";
import { clamp, exponentialDecay, lerp } from "./utils";

export function initGame(canvas: HTMLCanvasElement, CANVAS_WIDTH: number, CANVAS_HEIGHT: number, username: string) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return;

    let gameRunning = true
    ctx.imageSmoothingEnabled = false;
    canvas.style.backgroundColor = 'white'
    let gameLoopAnimation: number;
    let currentMouseX = CANVAS_WIDTH / 2;
    let currentMouseY = CANVAS_HEIGHT / 2;
    const defaultPlayerSize = 12
    let cameraX = 0;
    let cameraY = 0;
    let currentZoom = 2;

    const Player = new Blob(defaultPlayerSize, 'black', 0, 0, username)

    const blobs: Blob[] = []

    // HANDLER FUNCTIONS
    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        currentMouseX = e.clientX - rect.left;
        currentMouseY = e.clientY - rect.top;
    }

    const handleWheel =  (e: WheelEvent) => {
        e.preventDefault()
    }
    // HANDLER OVER

    window.addEventListener('mousemove', handleMouseMove)

    window.addEventListener('wheel',handleWheel);


    function gameLoop() {
        const MAX_DISTANCE = Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) * clamp(Player.targetR / Player.r, 1.2, 2);
        if (!ctx) return;
        ctx.save();

        // Calculate world position for mouse
        const worldMouseX = currentMouseX + cameraX;
        const worldMouseY = currentMouseY + cameraY;

        // Calculate zoom target based on size AND growth
        const zoomFactor = exponentialDecay(3.32, 0.1, Player.r, 1);
        // Update player with world-space mouse coordinates
        Player.setNewCoords(worldMouseX, worldMouseY);
        Player.update();
        // Update world offset based on player position
        cameraX = Player.x - CANVAS_WIDTH / 2;
        cameraY = Player.y - CANVAS_HEIGHT / 2;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)



        if (Math.abs(currentZoom - zoomFactor) < 0.001) {
            currentZoom = zoomFactor;
        } else {
            console.log('current zoom and zoom factor not equal: ', currentZoom, zoomFactor)
            currentZoom = lerp(currentZoom, zoomFactor, 0.01);
        }
        ctx.scale(currentZoom, currentZoom)
        ctx.translate(-Player.x, -Player.y)

        drawGrid(ctx, Player, CANVAS_WIDTH, CANVAS_HEIGHT, currentZoom)
        spawnBlobsNearPlayer(CANVAS_WIDTH, CANVAS_HEIGHT, Player, blobs)
        for (let i = blobs.length - 1; i >= 0; i--) {
            const dx = Player.x - blobs[i].x;
            const dy = Player.y - blobs[i].y;
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
        gameLoopAnimation = requestAnimationFrame(gameLoop)
        if (gameRunning == false) {
            cancelAnimationFrame(gameLoopAnimation)
        }
    }
    gameLoop();
    return {
        cleanup: () => {
            console.log("Cleanup function called");
            gameRunning = false
            cancelAnimationFrame(gameLoopAnimation)
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('wheel', handleWheel);
            console.log("Cleanup complete");
        }
    }
}

