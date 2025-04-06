import { lerp } from "./utils";

export class Blob {
    x: number;
    y: number;
    r: number;
    color: string;
    pos: { x: number, y: number };
    targetR: number;
    isAlive: boolean = true
    constructor( r: number, color: string, x: number, y: number) {
        this.x = x
        this.y = y
        this.r = r;
        this.color = color;
        this.pos = { x: this.x, y: this.y };
        this.targetR = r
        console.log('Initial coords of the blob', this.x, this.y)
    }
    
    draw(ctx: CanvasRenderingContext2D) {
        if(!this.isAlive) return;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    update() {
        // Update x and y from pos for compatibility
        this.x = this.pos.x;
        this.y = this.pos.y;
        this.r += lerp(this.targetR, this.r )
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
        const gameSpeed = 7
        // Calculate vector from center to mouse
        const centerX = mouseX;
        const centerY = mouseY;
        
        const vel = this.createVector(centerX - this.pos.x, centerY - this.pos.y);
        const scaledVel = this.setMag(vel, gameSpeed);
        
        // Add velocity to position
        this.pos.x += scaledVel.x;
        this.pos.y += scaledVel.y;
    }

    eats(other: Blob){
        const distanceBwTwo = this.distance(this, other)
        
        if ( distanceBwTwo < this.r + other.r){
            const R = Math.sqrt(this.r ** 2 + other.r ** 2)
            
            if(this.r > other.r * 1.1){
                this.targetR = R
                other.isAlive = false
            }
            return true
        } else{
            return false
        }
    }
}