"use client"
import useWebSocket from "@/hooks/useWebSocket";
import MainCanvas from "./MainCanvas";
import { useGameStore, useUserStore } from "@/store/store";
import { GameMessage } from "@repo/common/schema";
import { useEffect, useState } from "react";
import { Blob } from "@/game/Blob";
import { parse } from "path";

export default function GameRoom() {
    const { ws: clientWS, isConnected } = useWebSocket('ws://localhost:8787/connect/ws/default');
    const { setGameState } = useGameStore();
    const { username, color } = useUserStore();
    const [dimension, setDimensions] = useState({ width: 0, height: 0 });

    // Set dimensions on mount and on resize
    useEffect(() => {
        function updateDimensions() {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        }

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Join message and message listener
    useEffect(() => {
        if (!isConnected || !clientWS) return;

        const joinMessage: GameMessage = {
            type: 'JOIN',
            data: {
                name: username,
                color: color
            }
        };
        clientWS.send(JSON.stringify(joinMessage));

        clientWS.onmessage = (ev: MessageEvent) => {
            const parsedMessage: GameMessage = JSON.parse(ev.data);
            if (parsedMessage.type === 'INIT_GAME') {
                setGameState({
                    blobs: parsedMessage.data.blobs,
                    Players: parsedMessage.data.otherPlayers,
                    selfPlayer: parsedMessage.data.selfPlayer,
                    clientBlobs: parsedMessage.data.blobs.map(blob => {
                        const newBlob = new Blob(blob.foodRadius, blob.color, blob.blobX, blob.blobY, blob.blobId)
                        return newBlob
                    }),
                    clientPlayers: new Map(
                        parsedMessage.data.otherPlayers.map(player => [
                            player.userId,
                            new Blob(
                                player.state.radius,
                                player.state.color!,
                                player.state.pos.x,
                                player.state.pos.y,
                                player.userId,
                                player.username
                            )
                        ])
                    ),
                    selfBlob: new Blob(parsedMessage.data.selfPlayer.state.radius, parsedMessage.data.selfPlayer.state.color!, parsedMessage.data.selfPlayer.state.pos.x, parsedMessage.data.selfPlayer.state.pos.y, parsedMessage.data.selfPlayer.userId, parsedMessage.data.selfPlayer.username),
                    hasGameStarted: true,
                });
            } else if (parsedMessage.type === 'SPAWN') {
                const newBlob = parsedMessage.data.blob
                const currentState = useGameStore.getState();

                // Check if blob exists
                const blobExists = currentState.blobs.some(b => b.blobId === newBlob.blobId);

                // Only update if the blob doesn't exist
                if (!blobExists) {
                    setGameState({
                        blobs: [...currentState.blobs, newBlob],
                        clientBlobs: [...currentState.clientBlobs, new Blob(newBlob.foodRadius, newBlob.color, newBlob.blobX, newBlob.blobY, newBlob.blobId)]
                    });
                }
            } else if (parsedMessage.type === 'DESPAWN') {
                const removeBlobId = parsedMessage.data.blobId
                const currentState = useGameStore.getState()
                const updatedBlobs = currentState.blobs.filter(blob => blob.blobId !== removeBlobId);
                const updatedClientBlobs = currentState.clientBlobs.filter(b => b.userId !== removeBlobId)
                setGameState({
                    blobs: updatedBlobs,
                    clientBlobs: updatedClientBlobs
                });
            } else if (parsedMessage.type === 'GAME_OVER') {
                clientWS.close()
            } else if (parsedMessage.type === 'NEW_PLAYER') {
                const newPlayer = parsedMessage.data.player
                const currentState = useGameStore.getState();
                const newBlob = new Blob(
                    newPlayer.state.radius,
                    newPlayer.state.color!,
                    newPlayer.state.pos.x,
                    newPlayer.state.pos.y,
                    newPlayer.userId,
                    newPlayer.username
                );

                const updatedMap = new Map(currentState.clientPlayers);
                updatedMap.set(newPlayer.userId, newBlob);

                setGameState({
                    Players: [...currentState.Players, newPlayer],
                    clientPlayers: updatedMap
                });

            } else if (parsedMessage.type === 'MOVE') {
                const movedPlayer = parsedMessage.data
                const currentState = useGameStore.getState();
                const movedBlob = new Blob(
                    movedPlayer.state.radius,
                    movedPlayer.state.color!,
                    movedPlayer.state.pos.x,
                    movedPlayer.state.pos.y,
                    movedPlayer.userId,
                    movedPlayer.username
                );

                const updatedMap = new Map(currentState.clientPlayers);
                updatedMap.set(movedBlob.userId, movedBlob);

                setGameState({
                    Players: [...currentState.Players, movedPlayer],
                    clientPlayers: updatedMap
                });
            } else if (parsedMessage.type === 'LEAVE') {
                const leftPlayerId = parsedMessage.data.id
                const { Players, clientPlayers } = useGameStore.getState();

                const updatedPlayers = Players.filter(player => player.userId !== leftPlayerId);

                const updatedMap = new Map(clientPlayers);
                updatedMap.delete(leftPlayerId)

                setGameState({
                    Players: updatedPlayers,
                    clientPlayers: updatedMap
                });
            } else if (parsedMessage.type === 'EAT') {
                const {  targetId } = parsedMessage.data;

                const { clientBlobs, blobs, clientPlayers, Players, selfBlob } = useGameStore.getState()

                const blobIndex = clientBlobs.findIndex(blob => blob.userId === targetId);
                if (blobIndex !== -1) {
                    clientBlobs.splice(blobIndex, 1);
                    setGameState({ clientBlobs: [...clientBlobs] }); 
                    return;
                }

                if (clientPlayers.has(targetId)) {
                    const updatedMap = new Map(clientPlayers);
                    updatedMap.delete(targetId);
                    setGameState({ clientPlayers: updatedMap });
                    return;
                }

                if (selfBlob?.userId === targetId) {
                    alert("You got eaten!");
                    // You could also trigger a reset or redirect
                    return;
                }
            }
        };

        return () => {
            clientWS.onmessage = null;
        };
    }, [isConnected]);

    if (!isConnected || !clientWS) {
        return <p className="text-black text-5xl">Connecting...</p>;
    }


    return (
        <MainCanvas clientWS={clientWS} dimension={dimension} />
    );
}
