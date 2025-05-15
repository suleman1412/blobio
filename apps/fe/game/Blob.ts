import { GameMessage } from "@repo/common/schema";
import { clamp, lerp, distance, createVector, setMag } from "./utils";
import { useGameStore } from "@/store/store";

type BlobClassify = 'player' | 'blob'

export class Blob {
    r: number;
    color: string;
    pos: { x: number, y: number };
    targetR: number;
    isAlive: boolean = true;
    label?: string;
    growthRate: number = 0;
    isMoving: boolean;
    userId: string;
    classify: BlobClassify
    constructor(r: number, color: string, x: number, y: number, userId: string, classify: BlobClassify, label?: string) {
        this.r = r;
        this.color = color;
        this.pos = { x: x, y: y };
        this.targetR = r
        this.label = label
        this.isMoving = false
        this.userId = userId
        this.classify = classify
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.isAlive) return;

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
                const centerX = x + PIXEL_SIZE / 2;
                const centerY = y + PIXEL_SIZE / 2;

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
    setNewCoords(worldMouseCoords: { x: number, y: number }, ws: WebSocket) {

        const directionX = worldMouseCoords.x - this.pos.x;
        const directionY = worldMouseCoords.y - this.pos.y;
        const distanceToMouse = distance(this.pos, worldMouseCoords);
        if (distanceToMouse <= this.r / 6) {
            this.isMoving = false
            return
        };

        // Speed based on player size (larger = slower)
        const minSpeed = 2;
        const maxSpeed = 6;
        const gameSpeed = clamp((maxSpeed - Math.sqrt(this.r)) * lerp(1, 0, 0.1), minSpeed, 100);
        // console.log('Player speed: ',gameSpeed)

        const vel = createVector(directionX, directionY);
        const scaledSpeed = Math.min(gameSpeed, distanceToMouse * 0.1); // smooth stop near cursor
        const scaledVel = setMag(vel, scaledSpeed);

        this.pos.x += scaledVel.x;
        this.pos.y += scaledVel.y;

        if (this.isMoving) {
            this.sendMoveMessage(ws)
        }

        this.isMoving = true
    }
    sendMoveMessage(ws: WebSocket) {
        const MoveMessage: GameMessage = {
            type: 'MOVE',
            data: {
                username: this.label ?? 'unknown',
                userId: this.userId,
                classify: 'player',
                state: {
                    pos: { x: this.pos.x, y: this.pos.y },
                    radius: this.r,
                    color: this.color
                }
            }
        }
        ws.send(JSON.stringify(MoveMessage))
    }
    sendEatMessage(eaterId: string, targetId: string, ws: WebSocket) {
        const EatMessage: GameMessage = {
            type: 'EAT',
            data: {
                eaterId: eaterId,
                targetId: targetId
            }
        }
        ws.send(JSON.stringify(EatMessage))
    }
    sendGameOverMessage(ws: WebSocket) {
        const GameOverMessage: GameMessage = {
            type: 'GAME_OVER',
        }
        ws.send(JSON.stringify(GameOverMessage))
    }
    eats(other: Blob, ws: WebSocket) {
        const distanceBwTwo = distance(this.pos, other.pos);
        const { selfBlob, setGameState } = useGameStore.getState();

        if (distanceBwTwo > this.r + other.r) return false; 

        console.log('[eats] collision detected');
        const combinedR = Math.sqrt(this.r ** 2 + other.r ** 2);

        // If self is at least 10% bigger than anything
        if (this.r >= other.r * 1.1) {
            this.targetR = combinedR;
            other.isAlive = false;
            this.r += (this.targetR - this.r) * 0.5;
            this.sendEatMessage(this.userId, other.userId, ws);
            return true;
        }

        // If collided and other is bigger, die
        if (other.r > this.r) {
            if (selfBlob) {
                selfBlob.isAlive = false;
                setGameState({
                    selfBlob,
                    hasGameStarted: false,
                });
                this.sendEatMessage(other.userId, this.userId, ws);
            }
            return 0;
        }

        return false; 
    }



}