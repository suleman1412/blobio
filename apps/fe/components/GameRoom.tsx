"use client"
import useWebSocket from "@/hooks/useWebSocket";
import MainCanvas from "./MainCanvas";
import { useGameStore, useUserStore } from "@/store/store";
import { GameMessage } from "@repo/common/schema";
import { useEffect, useState } from "react";
import { Blob } from "@/game/Blob";
import LandingPage from "./LandingPage";

export default function GameRoom() {
    // TODO: need to work on room creation to propogate from frontend if  registered / authorized user
    const { ws: clientWS, isConnected } = useWebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/connect/ws/defaultRoom`);
    const { selfBlob, hasGameStarted, serverConnectionMade, setGameState } = useGameStore();
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
            setGameState({ serverConnectionMade: true })
            const parsedMessage: GameMessage = JSON.parse(ev.data);
            if (parsedMessage.type === 'INIT_GAME') {
                setGameState({
                    clientBlobs: new Map(
                        parsedMessage.data.blobs.map(blob => [
                            blob.blobId,
                            new Blob(
                                blob.foodRadius,
                                blob.color!,
                                blob.blobX,
                                blob.blobY,
                                blob.blobId,
                                blob.classify
                            )
                        ])),
                    clientPlayers: new Map(
                        parsedMessage.data.otherPlayers.map(player => [
                            player.userId,
                            new Blob(
                                player.state.radius,
                                player.state.color!,
                                player.state.pos.x,
                                player.state.pos.y,
                                player.userId,
                                player.classify,
                                player.username
                            )
                        ])
                    ),
                    selfBlob: new Blob(parsedMessage.data.selfPlayer.state.radius, parsedMessage.data.selfPlayer.state.color!, parsedMessage.data.selfPlayer.state.pos.x, parsedMessage.data.selfPlayer.state.pos.y, parsedMessage.data.selfPlayer.userId, parsedMessage.data.selfPlayer.classify, parsedMessage.data.selfPlayer.username),
                    // hasGameStarted: true,
                });
            } else if (parsedMessage.type === 'SPAWN') {
                const newFood = parsedMessage.data.blob

                const { clientBlobs } = useGameStore.getState();
                const newBlob = new Blob(
                    newFood.foodRadius,
                    newFood.color!,
                    newFood.blobX,
                    newFood.blobY,
                    newFood.blobId,
                    newFood.classify
                );

                const updatedMap = new Map(clientBlobs);
                updatedMap.set(newFood.blobId, newBlob)

                setGameState({
                    clientBlobs: updatedMap
                });
            } else if (parsedMessage.type === 'DESPAWN') {
                const removeBlobId = parsedMessage.data.blobId
                const { clientBlobs } = useGameStore.getState()

                const updatedMap = new Map(clientBlobs);
                updatedMap.delete(removeBlobId)

                setGameState({
                    clientBlobs: updatedMap
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
                    newPlayer.classify,
                    newPlayer.username
                );

                const updatedMap = new Map(currentState.clientPlayers);
                updatedMap.set(newPlayer.userId, newBlob);

                setGameState({
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
                    movedPlayer.classify,
                    movedPlayer.username
                );

                const updatedMap = new Map(currentState.clientPlayers);
                updatedMap.set(movedBlob.userId, movedBlob);

                setGameState({
                    clientPlayers: updatedMap
                });
            } else if (parsedMessage.type === 'LEAVE') {
                const leftPlayerId = parsedMessage.data.id
                const { clientPlayers } = useGameStore.getState();

                const updatedMap = new Map(clientPlayers);
                updatedMap.delete(leftPlayerId)

                setGameState({
                    clientPlayers: updatedMap
                });
            } else if (parsedMessage.type === 'EAT') {
                const { targetId } = parsedMessage.data;

                const { clientBlobs, clientPlayers, selfBlob } = useGameStore.getState()

                if (clientBlobs.has(targetId)) {
                    const updatedMap = new Map(clientBlobs);
                    updatedMap.delete(targetId);
                    setGameState({ clientBlobs: updatedMap });
                    return;
                }


                if (clientPlayers.has(targetId)) {
                    const updatedMap = new Map(clientPlayers);
                    updatedMap.delete(targetId);
                    setGameState({ clientPlayers: updatedMap });
                    return;
                }
                if (selfBlob) {
                    if (selfBlob.userId === targetId) {
                        // alert("[GameRoom]You got eaten!");
                        selfBlob.isAlive = false;
                        setGameState({ selfBlob: selfBlob })
                    }
                }
            }
        };

        return () => {
            clientWS.onmessage = null;
        };
    }, [isConnected]);


    if (selfBlob?.isAlive === false) {
        alert('You died');
        setGameState({ selfBlob: undefined });
    }

    if (hasGameStarted && (!clientWS || !isConnected)) {
        return <p className="text-background text-5xl">Connecting...</p>;
    }

    if (!hasGameStarted && selfBlob === undefined) {
        return <LandingPage />;
    }

    return (
        <MainCanvas clientWS={clientWS!} isConnected={isConnected} dimension={dimension} />
    );


}
