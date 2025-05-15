import { useGameStore } from "@/store/store";
import { useEffect, useRef, useState } from "react";

const useWebSocket = (url: string) => {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const connectionAttemptedRef = useRef(false);

    const hasGameStarted = useGameStore(state => state.hasGameStarted)

    useEffect(() => {
        // Only create socket if game has started and no connection attempt is in progress
        if (!hasGameStarted || connectionAttemptedRef.current) {
            return;
        }

        // If we already have an open or connecting socket, don't create a new one
        if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
            return;
        }

        console.log('Creating WebSocket connection');
        connectionAttemptedRef.current = true;
        wsRef.current = new WebSocket(url);

        const socket = wsRef.current;

        socket.onopen = () => {
            console.log('WebSocket connected');
            connectionAttemptedRef.current = false;
            if (socket.readyState === WebSocket.OPEN) {
                setIsConnected(true);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket closed');
            setIsConnected(false);
            connectionAttemptedRef.current = false;
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            connectionAttemptedRef.current = false;
        };

        // Clean up function
        return () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
            connectionAttemptedRef.current = false;
        };
    }, [hasGameStarted]);

    return { ws: wsRef.current, isConnected };
};

export default useWebSocket;