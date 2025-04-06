"use client"
import { useEffect, useRef } from "react"
import {initGame} from "../game";

export const CANVAS_WIDTH = 2000;
export const CANVAS_HEIGHT = 1000;

export default function MainCanvas(){
    
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    useEffect(() => {
        if (!canvasRef.current) return;
        initGame(canvasRef.current);
      }, [canvasRef.current]);
    return(
        <div>
            <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="border-2">
                Canvas for Agario
            </canvas>
        </div>
    )
}