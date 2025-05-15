"use client"
import { useEffect, useRef, useState } from "react"
import { initGame } from "../game/initGame";
import { useGameStore } from "@/store/store";


export default function MainCanvas({ clientWS, dimension }: {
    clientWS: WebSocket,
    dimension: { width: number, height: number }
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const { hasGameStarted, renderCanvasFlag, selfBlob } = useGameStore()

    useEffect(() => {
        if (!canvasRef.current || !clientWS) return;
        if (!hasGameStarted) return;
        const gameInstance = initGame(canvasRef.current, dimension.width, dimension.height, clientWS);
        return () => {
            if (gameInstance?.cleanup) {
                gameInstance.cleanup()
            }
        }
    }, [selfBlob?.isAlive]);

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