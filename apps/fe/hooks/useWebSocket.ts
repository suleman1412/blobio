import { useEffect, useRef, useState } from "react";

const useWebSocket = (url: string) => {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        console.log("[WebSocket Hook] useEffect triggered with URL:", url);

        wsRef.current = new WebSocket(url);
        if (!wsRef.current) return; 

        const socket = wsRef.current
        
        socket.onopen = () => {
            console.log("Connection made");
            setIsConnected(true);
        };

        socket.onclose = () => {
            console.log("Connection closed");
            setIsConnected(false);
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        // Cleanup on unmount
        return () => {
            if (socket?.readyState === WebSocket.OPEN) {
                socket.close()
            }
        };
    }, [url]);

    return { ws: wsRef.current, isConnected };
};

export default useWebSocket;
