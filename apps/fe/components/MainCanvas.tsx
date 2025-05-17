"use client"
import { useEffect, useRef } from "react"
import { initGame } from "../game/initGame";
import { useGameStore } from "@/store/store";


export default function MainCanvas({ clientWS, isConnected, dimension }: {
    clientWS: WebSocket,
    isConnected: boolean,
    dimension: { width: number, height: number }
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const { hasGameStarted, selfBlob, clientPlayers, serverConnectionMade } = useGameStore()

    useEffect(() => {
        if (!canvasRef.current || !clientWS) return;
        if (!hasGameStarted) return;
        const gameInstance = initGame(canvasRef.current, dimension.width, dimension.height, clientWS);
        return () => {
            if (gameInstance?.cleanup) {
                gameInstance.cleanup()
            }
        }
    }, [isConnected, selfBlob?.isAlive, serverConnectionMade ]);

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
            <canvas ref={canvasRef} width={dimension.width} height={dimension.height} className="pixelsCanvas bg-foreground">
                Canvas for BlobIo
            </canvas>
            <div className="absolute top-4 right-4 z-10 w-64 h-80 p-4 text-background font-spaceGro rounded-xl shadow-lg backdrop-blur-md">
                <h2 className="text-2xl font-bold mb-2">
                    Leaderboard
                </h2>
                <ul className="space-y-2 text-md font-spaceGro font-medium">
                    {[
                        ...(selfBlob ? [selfBlob] : []),
                        ...Array.from(clientPlayers.values())
                    ]
                        .sort((a, b) => b.r - a.r) 
                        .slice(0, 10) // Top 10
                        .map((player, index) => (
                            <li key={player.userId} className="flex justify-between">
                                <span>{index + 1}. {player.label || 'Unnamed'}</span>
                                <span>{Math.round(player.r)}</span>
                            </li>
                        ))}
                </ul>

            </div>
        </div>
    )
}