import { BlobType, UserState } from "@repo/common/schema";
import { Blob } from "./Blob";

export interface GameState {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    CANVAS_WIDTH: number;
    CANVAS_HEIGHT: number;
    selfPlayer: Blob;
    blobs: BlobType[];
    otherPlayers: UserState[]
    mouseCoords : { x: number, y: number }
    cameraCoords : { x: number, y: number }
    currentZoom: number;
    gameRunning: boolean;
    clientWS: WebSocket;
}