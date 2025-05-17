import { DurableObject } from "cloudflare:workers";
import { randomFoodRadius } from "./utils";
import { generateRandomColor } from '@repo/common/schema';
import { BlobType, GameMessage, UserState } from "@repo/common/schema";

declare global {
	interface WebSocket {
		userId: string;
	}
}

export class GameRoom extends DurableObject<Env> {
	connectedUsers: Map<WebSocket, UserState>
	defaultPlayerRadius: number
	gameState: {
		blobs: Map<string, BlobType>;
		CANVAS_WIDTH: number,
		CANVAS_HEIGHT: number
	};
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env)
		this.connectedUsers = new Map()
		this.defaultPlayerRadius = 16;
		this.gameState = {
			blobs: new Map(),
			CANVAS_HEIGHT: 3000,
			CANVAS_WIDTH: 3000
		}
		for (let i = 0; i <= 1000; i++) {
			this.createFoodBlob()
		}
	}
	private createFoodBlob(): BlobType {
		const randomBlobId = crypto.randomUUID().toString();

		const newBlob: BlobType = {
			color: generateRandomColor(),
			foodRadius: randomFoodRadius(),
			blobX: Math.random() * 2 * this.gameState.CANVAS_WIDTH - this.gameState.CANVAS_WIDTH,
			blobY: Math.random() * 2 * this.gameState.CANVAS_HEIGHT - this.gameState.CANVAS_HEIGHT,
			blobId: randomBlobId,
			classify: 'blob'
		};

		this.gameState.blobs.set(randomBlobId, newBlob);
		return newBlob;
	}
	private broadcastToOthers(ws: WebSocket, message: GameMessage) {
		for (const [conn, _] of this.connectedUsers.entries()) {
			if (conn != ws && conn.readyState === WebSocket.OPEN) {
				try {
					// console.log('[broadcastToOthers]: ', message)
					// console.log('[broadcastToOthers] all connections: ', this.connectedUsers.entries())
					conn.send(JSON.stringify(message));
				} catch (e) {
					this.heartBeat(conn)
				}
			}
		}
	}
	private InitGameStateSender(ws: WebSocket) {
		// Send initial game state to the new player
		const gameInitMessage: GameMessage = {
			type: 'INIT_GAME',
			data: {
				blobs: Array.from(this.gameState.blobs.entries()).map(([id, blob]) => blob),
				otherPlayers: Array.from(this.connectedUsers.values()).filter(user => user.userId != ws.userId),
				selfPlayer: this.connectedUsers.get(ws) ?? (() => { throw new Error('UserState not found for WebSocket'); })()
			}
		};
		this.broadcastToPlayer(ws, gameInitMessage)
	}
	private broadcastToPlayer(ws: WebSocket, message: GameMessage) {
		ws.send(JSON.stringify(message))
	}
	private broadcastToAll(message: GameMessage) {
		// Fn to broadcast to all players and also act as a heartbeat server
		for (const [conn, _] of this.connectedUsers.entries()) {
			if (conn.readyState === WebSocket.OPEN) {
				try {
					conn.send(JSON.stringify(message));
				} catch (e) {
					this.heartBeat(conn)
				}
			} else {
				this.heartBeat(conn)
			}
		}
	}
	private DespawnBlob(blobId: string) {
		// Deletes the blob, sends a despawn message to everyone
		this.gameState.blobs.delete(blobId)
		const DespawnMessage: GameMessage = {
			type: 'DESPAWN',
			data: {
				blobId: blobId
			}
		}
		this.broadcastToAll(DespawnMessage)
	}
	private heartBeat(conn: WebSocket) {
		console.warn('Stale connection. Removing connection.', conn.userId)
		this.connectedUsers.delete(conn);
		conn.close()
	}
	private SpawnBlob() {
		const newBlob = this.createFoodBlob()

		// Send a SPAWN message
		const SpawnMessage: GameMessage = {
			type: 'SPAWN',
			data: {
				blob: newBlob
			}
		}
		this.broadcastToAll(SpawnMessage)

	}


	async fetch(req: Request) {

		const url = new URL(req.url);
		const userId = url.searchParams.get('userId');

		if (!userId) {
			return new Response('Missing userId', { status: 400 });
		}

		const { 0: clientWS, 1: serverWS } = new WebSocketPair()
		this.ctx.acceptWebSocket(serverWS);

		// Pinning the server generated userIds from connectRouter to respective WS
		serverWS.userId = userId;

		console.log('pair created')

		setInterval(() => {
			console.log('Total JOINED users: ', this.connectedUsers.size)
		}, 5000)
		return new Response(null, {
			status: 101,
			webSocket: clientWS
		})
	}

	webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): void | Promise<void> {
		if (typeof message !== 'string') return;

		const parsedMessage: GameMessage = JSON.parse(message);

		try {
			// Handle JOIN message specifically to register the user
			if (parsedMessage.type === 'JOIN') {
				// Check if this user is already connected
				const existingUser = this.connectedUsers.has(ws)

				if (existingUser) {
					// User already connected, could send an error or handle reconnection
					ws.send(JSON.stringify({
						type: 'ERROR',
						data: { message: 'User already connected' }
					}));
					return;
				}

				// Create the full user state now that they've properly joined
				const initialUserState: UserState = {
					username: parsedMessage.data.name,
					userId: ws.userId,
					classify: 'player',
					state: {
						radius: this.defaultPlayerRadius,
						color: parsedMessage.data.color,
						pos: {
							// x: Math.random() * 100 * 2 - 100,
							// y: Math.random() * 100 * 2 - 100
							x: Math.random() * this.gameState.CANVAS_WIDTH * 2 - this.gameState.CANVAS_WIDTH,
							y: Math.random() * this.gameState.CANVAS_HEIGHT * 2 - this.gameState.CANVAS_HEIGHT
						}
					}
				};

				// Now officially add them to connected users
				this.connectedUsers.set(ws, initialUserState);


				this.InitGameStateSender(ws)

				// Send the new player joined message to all connected users
				const sender = this.connectedUsers.get(ws)
				if (!sender) return;
				const new_player_joined: GameMessage = {
					type: 'NEW_PLAYER',
					data: {
						player: sender
					}
				}
				this.broadcastToOthers(ws, new_player_joined)
			} else if (parsedMessage.type === 'MOVE') {

				// Update the player's position in our state
				const player = this.connectedUsers.get(ws);
				if (!player) return;

				this.connectedUsers.set(ws, {
					userId: ws.userId,
					username: parsedMessage.data.username,
					classify: 'player',
					state: {
						radius: parsedMessage.data.state.radius,
						pos: {
							x: parsedMessage.data.state.pos.x,
							y: parsedMessage.data.state.pos.y
						}
					}
				})

				this.broadcastToOthers(ws, parsedMessage);

			} else if (parsedMessage.type === 'EAT') {
				this.broadcastToOthers(ws, parsedMessage)
				console.log('EAT detected', parsedMessage)

				// Check if the targetId was a blob or a player
				// To check if it was a blob: 
				if (this.gameState.blobs.has(parsedMessage.data.targetId)) {

					// Remove the targetId from the blobs list and send a despawn message to everyone and create a new one to replace
					const blobId = parsedMessage.data.targetId
					this.DespawnBlob(blobId)
					// Spawn a new blob randomly and notify all Players
					this.SpawnBlob()
				} else {
					// TargetId is another Player
					// Send a GAME_OVER message to the targetId
					// Remove the player from the state
					const targetWS = Array.from(this.connectedUsers.keys()).find(ws => ws.userId === parsedMessage.data.targetId)
					if (!targetWS) return;

					// Send the GAMEOVER message to player and close their socket
					const GameOver: GameMessage = {
						type: 'GAME_OVER'
					}
					// Send the message only to the target
					this.broadcastToPlayer(targetWS, GameOver)
					// Socket close, the gameState will be updated automatically in Websocketclose()
					targetWS.close()
				}
			} else if (parsedMessage.type === 'GAME_OVER'){
				this.broadcastToPlayer(ws, parsedMessage)
			}
		} catch (error) {
			console.error("Error parsing WebSocket message: ", error);
		}
	}


	webSocketClose(ws: WebSocket) {
		// Remove the socket from connectedSUers state
		this.connectedUsers.delete(ws);
		const leaveMessage: GameMessage = {
			type: 'LEAVE',
			data: {
				id: ws.userId
			}
		};

		this.broadcastToAll(leaveMessage);

		console.log(`Player ${ws.userId} disconnected. ${this.connectedUsers.size} players remaining.`);
	}

	webSocketError(ws: WebSocket, err: any) {
		console.error("WebSocket error:", err);
		this.connectedUsers.delete(ws);
	}
}