"use client"
import { useEffect, useRef, useState } from "react"
import { initGame } from "../game/initGame";
import { useGameStore, useUserStore } from "@/store/store";


export default function MainCanvas({ clientWS, dimension }: {
    clientWS: WebSocket,
    dimension: { width: number, height: number }
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const { hasGameStarted } = useGameStore()
    const { username } = useUserStore()

    useEffect(() => {
        console.log('hasGameStarted:' ,hasGameStarted)
    }, [hasGameStarted])

    useEffect(() => {
        if (!canvasRef.current || !clientWS) return;
        if (!hasGameStarted) return;

        const gameInstance = initGame(canvasRef.current, dimension.width, dimension.height, clientWS);
        return () => {
            if (gameInstance?.cleanup) {
                gameInstance.cleanup()
            }
        }
    }, [hasGameStarted]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        };

        window.addEventListener("wheel", handleWheel);
        return () => window.removeEventListener("wheel", handleWheel);
    }, []);




    return (
        <div>
            <canvas ref={canvasRef} width={dimension.width} height={dimension.height} className="border-2 pixelsCanvas overflow-x-hidden overflow-y-hidden">
                Canvas for BlobIo
            </canvas>
        </div>
    )
}