import { useGameStore, useUserStore } from "@/store/store";
import gameLoop from "./gameLoop";
import { GameState } from '@repo/common/schema'
import { RefObject } from "react";


export function initGame(canvas: HTMLCanvasElement, CANVAS_WIDTH: number, CANVAS_HEIGHT: number, clientWS: WebSocket, BGMRef: RefObject<HTMLAudioElement | null>) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    let gameLoopAnimation: number;

    const { selfBlob, serverConnectionMade } = useGameStore.getState()

    const state: GameState = {
        canvas,
        ctx,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        mouseCoords: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
        cameraCoords: { x: 0, y: 0 },
        currentZoom: 2,
        clientWS
    };


    // HANDLER FUNCTIONS
    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        state.mouseCoords.x = e.clientX - rect.left;
        state.mouseCoords.y = e.clientY - rect.top;
    }

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault()
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('wheel', handleWheel);
    // HANDLER OVER
    
    if(!serverConnectionMade) return;
    const gameLoopWrapper = () => {
        gameLoop(state);
        gameLoopAnimation = requestAnimationFrame(gameLoopWrapper)
        if (selfBlob?.isAlive == false) {
            cancelAnimationFrame(gameLoopAnimation)
        }
    }

    gameLoopWrapper()

    return {
        cleanup: () => {
            cancelAnimationFrame(gameLoopAnimation)
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('wheel', handleWheel);
            if(BGMRef.current){
                BGMRef.current.pause();
                BGMRef.current.currentTime = 0;
            }
        }
    }
}

