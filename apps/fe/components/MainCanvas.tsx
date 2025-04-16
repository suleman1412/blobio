"use client"
import { useEffect, useRef, useState } from "react"
import {initGame} from "../game";



export default function MainCanvas({ username }: { username: string}){
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        setIsReady(true)
    }, [])
    useEffect(() => {

        if (!isReady || !canvasRef.current) return;

        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight

        const gameInstance = initGame(canvasRef.current, window.innerWidth, window.innerHeight, username);
        return () => {
            if(gameInstance?.cleanup){
                gameInstance.cleanup()
            }
        }
    }, [isReady]);

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