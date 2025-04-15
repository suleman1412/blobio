import { Blob } from "./Blob";

export function drawGrid(ctx: CanvasRenderingContext2D, Player: Blob, CANVAS_WIDTH: number, CANVAS_HEIGHT:number, currentZoom: number) {
    // Grid settings
    const gridSize = 50; // Size of each grid cell
    const gridColor = "#bdbdbd";
    
    // Get visible area boundaries based on camera position
    const startX = Math.floor(Player.x / gridSize) * gridSize - (CANVAS_WIDTH / 2 / currentZoom);
    const startY = Math.floor(Player.y / gridSize) * gridSize - (CANVAS_HEIGHT / 2 / currentZoom);
    const endX = startX + (CANVAS_WIDTH / currentZoom) + gridSize;
    const endY = startY + (CANVAS_HEIGHT / currentZoom) + gridSize;
    
    // Set line style
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    
    // Draw vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
    }
    
    // Draw horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
    }
    
    ctx.stroke();
}