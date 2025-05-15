import { useGameStore } from "@/store/store";
import { useEffect, useRef, useState } from "react";

const useWebSocket = (url: string) => {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { hasGameStarted, selfBlob } = useGameStore.getState()


    useEffect(() => {
        wsRef.current = new WebSocket(url);
        if (!wsRef.current) return;
        const socket = wsRef.current;

        socket.onopen = () => {
            setIsConnected(true)
        };

        socket.onclose = () => {
            setIsConnected(false)
            wsRef.current = null
        };


        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, []);

    

    return { ws: wsRef.current, isConnected };
};

export default useWebSocket;
