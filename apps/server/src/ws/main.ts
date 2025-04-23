import { DurableObject } from "cloudflare:workers";
import checkWS from "./utils";
import { GameMessage } from "@repo/common/schema";

export class GameRoom extends DurableObject<Env> {
	serverConnections: Set<WebSocket>;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.serverConnections = new Set()

		const existingConnections: WebSocket[] = this.ctx.getWebSockets()
		for (const existingConn of existingConnections) {
			this.serverConnections.add(existingConn)
		}
	}


	async fetch(req: Request) {
		// When it receives a request here, it is a normal HTTP request with a upgrade header. It only upgrades the protocol when this func returns.
	
		const websocketPair = new WebSocketPair();
		const [clientWS, serverWS] = Object.values(websocketPair);
		console.log('[DO main.ts] clientWS and serverWS generated')
		if (!serverWS || !clientWS) return new Response('Error in allotting server and client WS', { status: 500 })


		this.ctx.acceptWebSocket(serverWS);
		this.serverConnections.add(serverWS)
		return new Response(null, {
			status: 101,
			webSocket: clientWS
		})
	}

	webSocketError(serverWS: WebSocket, error: unknown) {
		console.error("webSocketError", error);
		this.serverConnections.delete(serverWS);
	}

	webSocketMessage(serverWS: WebSocket, message: string | ArrayBuffer): void {
		console.log("[GameRoom] Incoming message:", message);
		for (const conn of this.serverConnections) {
			// Don't send the message back to the sender
			if (conn !== serverWS && conn.readyState === WebSocket.OPEN) {
			  conn.send(message);
			}
		  }
	}


	webSocketClose(
		ws: WebSocket,
		_code: number,
		_reason: string,
		_wasClean: boolean
	) {
		console.log("webSocketClose, serverConnections", this.serverConnections);
		this.serverConnections.delete(ws);
	}
}