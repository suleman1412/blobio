import { Blob } from "./Blob";

export interface GameState {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    CANVAS_WIDTH: number;
    CANVAS_HEIGHT: number;
    Player: Blob;
    blobs: Blob[];
    mouseCoords : { x: number, y: number }
    cameraCoords : { x: number, y: number }
    currentZoom: number;
    gameRunning: boolean;
    clientWS: WebSocket;
}