"use client"
import { useEffect, useRef } from "react"
import {initGame} from "../game";



export default function MainCanvas(){
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    useEffect(() => {

        if (!canvasRef.current) return;

        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight

        initGame(canvasRef.current, window.innerWidth, window.innerHeight);
      
    }, [canvasRef.current]);

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