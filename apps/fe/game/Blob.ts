import { clamp, lerp } from "./utils";

export class Blob {
    r: number;
    x: number;
    y: number;
    color: string;
    pos: { x: number, y: number };
    targetR: number;
    isAlive: boolean = true;
    label?: string;
    previousR: number;
    growthRate: number = 0;
    constructor( r: number, color: string, x: number, y: number, label?: string) {
        this.x = x
        this.y = y
        this.r = r;
        this.color = color;
        this.pos = { x: this.x, y: this.y };
        this.targetR = r
        this.previousR = r;
        this.label = label
    }
    
    draw(ctx: CanvasRenderingContext2D) {
        if(!this.isAlive) return;
        
        if (this.label) {
            ctx.fillStyle = "black";
            ctx.strokeStyle = "red";
            ctx.font = `${this.r / 2}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillText(this.label, this.pos.x, this.pos.y - this.r - 5);
            ctx.strokeText(this.label, this.pos.x, this.pos.y - this.r - 5);
        }

        const PIXEL_SIZE = 4;
        const left = Math.floor((this.pos.x - this.r) / PIXEL_SIZE) * PIXEL_SIZE;
        const top = Math.floor((this.pos.y - this.r) / PIXEL_SIZE) * PIXEL_SIZE;
        const right = Math.ceil((this.pos.x + this.r) / PIXEL_SIZE) * PIXEL_SIZE;
        const bottom = Math.ceil((this.pos.y + this.r) / PIXEL_SIZE) * PIXEL_SIZE;
        
        ctx.fillStyle = this.color;
        // Loop through just the pixels in the blob's bounding box
        for (let x = left; x < right; x += PIXEL_SIZE) {
            for (let y = top; y < bottom; y += PIXEL_SIZE) {
                // For each pixel, check if its center is within the circle
                const centerX = x + PIXEL_SIZE/2;
                const centerY = y + PIXEL_SIZE/2;
                
                // Calculate squared distance from center of pixel to center of circle
                const distSquared = 
                    (centerX - this.pos.x) * (centerX - this.pos.x) + 
                    (centerY - this.pos.y) * (centerY - this.pos.y);
                
                // If this pixel's center is inside the circle radius, draw it
                if (distSquared <= this.r * this.r) {
                    ctx.fillRect(Math.floor(x), Math.floor(y), PIXEL_SIZE, PIXEL_SIZE);
                }
            }
        }
    }

    update() {
        // Update x and y from pos for compatibility
        this.x = this.pos.x;
        this.y = this.pos.y;
        
    }
    
    // Vector helper functions
    createVector(x: number, y: number) {
        return { x, y };
    }
    
    setMag(vector: {x: number, y: number}, magnitude: number) {
        const current = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        if (current === 0) return vector; 
        
        const scale = magnitude / current;
        return { x: vector.x * scale, y: vector.y * scale };
    }

    distance(V1: {x: number, y: number}, V2: { x:number, y: number}){
        return Math.sqrt((V2.x  - V1.x) ** 2 + (V2.y  - V1.y) ** 2 )
    }
    
    setNewCoords(mouseX: number, mouseY: number) {
        const directionX = mouseX - this.pos.x;
        const directionY = mouseY - this.pos.y;
        const distanceToMouse = this.distance(this.pos, { x: mouseX, y: mouseY });
        if (distanceToMouse < 1) return;
    
        // Speed based on player size (larger = slower)
        const minSpeed = 2;
        const maxSpeed = 10;
        const gameSpeed = clamp((maxSpeed - Math.sqrt(this.r)) * lerp(1,0,0.1), minSpeed, 100);
        console.log('Player speed: ',gameSpeed)
    
        const vel = this.createVector(directionX, directionY);
        const scaledSpeed = Math.min(gameSpeed, distanceToMouse * 0.1); // smooth stop near cursor
        const scaledVel = this.setMag(vel, scaledSpeed);
    
        this.pos.x += scaledVel.x;
        this.pos.y += scaledVel.y;

    }

    eats(other: Blob){
        const distanceBwTwo = this.distance(this, other)
        
        if ( distanceBwTwo < this.r + other.r){
            const R = Math.sqrt(this.r ** 2 + other.r ** 2)
            
            // Can only 'eat' a blob if 10% bigger than the other
            if(this.r > other.r * 1.1){
                this.targetR = R
                other.isAlive = false
                this.r += (this.targetR - this.r) * 0.5 
            }

             // Check if this blob is larger than the player, game over if true
             if (other.r > this.r) {
                return 0;
            }
            return true
        } else{
            return false
        }
    }
}