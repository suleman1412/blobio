import { useGameStore, useUserStore } from "@/store/store";
import { GameMessage } from "@repo/common/schema";
import { useEffect, useRef, useState } from "react";

const useWebSocket = (url: string) => {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    // const {  blobs, Players, setGameState } = useGameStore()

    
    // useEffect(() => {
    //     console.log('[useWebSocket] Blobs: ', blobs);
    //     console.log('[useWebSocket] Players: ', Players);
    // }, [blobs, Players]);

    useEffect(() => {

        wsRef.current = new WebSocket(url);
        if (!wsRef.current) return;
        const socket = wsRef.current;


        socket.onopen = () => {
            // console.log("[useWebsocket] Connection made");
            setIsConnected(true)
        };

        socket.onclose = () => {
            // console.log("Connection closed");
            setIsConnected(false)
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
