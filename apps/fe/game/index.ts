import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/components/MainCanvas";
import { Blob } from "./Blob"

export function initGame(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if(!ctx) return;
    
    let currentMouseX = CANVAS_WIDTH/2;
    let currentMouseY = CANVAS_HEIGHT/2;
    const defaultPlayerSize = 64
    let cameraX = 0;
    let cameraY = 0;
    
    const Player = new Blob(defaultPlayerSize, 'white', 0, 0)
    // const Player2 = new Blob(defaultPlayerSize + 500, 'blue', 0, 0)


    const blobs: Blob[] = []
    for(let i = 0; i < 650; i++){
        const x_range = Math.random() * CANVAS_WIDTH * 4 - CANVAS_WIDTH * 2
        const y_range = Math.random() * CANVAS_HEIGHT * 4 - CANVAS_HEIGHT * 2 
        blobs.push(new Blob(16, 'green', x_range, y_range))
    }

    window.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        currentMouseX = e.clientX - rect.left;
        currentMouseY = e.clientY - rect.top;
    })
    
    function gameLoop() {
        if(!ctx) return;
        ctx.save();
        
        // Calculate world position for mouse
        const worldMouseX = currentMouseX + cameraX;
        const worldMouseY = currentMouseY + cameraY;
        
        // Update player with world-space mouse coordinates
        Player.setNewCoords(worldMouseX, worldMouseY);
        Player.update();
        
        // Update world offset based on player position
        cameraX = Player.x - CANVAS_WIDTH/2;
        cameraY = Player.y - CANVAS_HEIGHT/2;
        
        // Clear and prepare for drawing
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // ctx.translate(-cameraX, -cameraY);
        ctx.translate(CANVAS_WIDTH/2, CANVAS_HEIGHT/2)
        
        ctx.scale(defaultPlayerSize /Player.r , defaultPlayerSize / Player.r)
        ctx.translate(-Player.x, -Player.y)
        
        for (let i = blobs.length - 1; i >= 0; i--) {
            blobs[i].draw(ctx);
            if (Player.eats(blobs[i])){
                blobs.splice(i, 1);
                const x_range = Math.random() * CANVAS_WIDTH * 4 - CANVAS_WIDTH * 2;
                const y_range = Math.random() * CANVAS_HEIGHT * 4 - CANVAS_HEIGHT * 2;
                blobs.push(new Blob(16, 'green', x_range, y_range));
            }
        }
        
        Player.draw(ctx);
        ctx.restore();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}