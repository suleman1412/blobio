"use client"
import { useEffect, useRef, useState } from "react"
import {initGame} from "../game/initGame";
import useWebSocket from "@/hooks/useWebSocket";



export default function MainCanvas({ username, clientWS }: { 
    username: string,
    clientWS: WebSocket
}){
    const canvasRef = useRef<HTMLCanvasElement | null>(null)



    useEffect(() => {

        if (!canvasRef.current || !clientWS) return;
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight

        const gameInstance = initGame(canvasRef.current, window.innerWidth, window.innerHeight, username, clientWS);
        return () => {
            if(gameInstance?.cleanup){
                gameInstance.cleanup()
            }
        }
    }, [clientWS]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
          if (e.ctrlKey) {
            e.preventDefault();
          }
        };
      
        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => window.removeEventListener("wheel", handleWheel);
    }, []);

    
    return(
        <div>
            <canvas ref={canvasRef} width={2000} height={2000} className="border-2 pixelsCanvas overflow-x-hidden overflow-y-hidden">
                Canvas for Agario
            </canvas>
        </div>
    )
}