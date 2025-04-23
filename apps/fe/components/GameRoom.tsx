"use client"
import useWebSocket from "@/hooks/useWebSocket";
import MainCanvas from "./MainCanvas";

export default function GameRoom({ username }: { username: string}){
    // TODO: cleanup the logic
    const { ws: clientWS, isConnected } = useWebSocket('ws://localhost:8787/connect/ws/default?token=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlF4VUNjNTkifQ.Ho59-4T7lII-auKlevFgp0m4MPDLsZaWwaoO5bcF5_M')
    if(!isConnected){
        return <p>
            Connecting to WebSocket...
        </p>
    }
    if(!clientWS) return;
    return (
        <MainCanvas username={username} clientWS={clientWS} />
    )    
}