import { z } from 'zod'

export const AuthSchema = z.object({
	username: z.string().min(3, { message: 'Username must be atleast 3 letters long' }),
	password: z.string().min(5, { message: 'Password must be atleast 3 letters long' }),
})
export const JWT_SECRET = 'suleman123'

type basicInfo = {
	id?: string;
	name: string;
	color: string;
	x?: number,
	y?: number,
	radius?: number
}

// client sends to server
type JoinMessage = {
	type: "JOIN";
	data: basicInfo;
};

// client sends to server
type MoveMessage = {
	type: "MOVE";
	data: UserState;
};

// client sends to server
type EatMessage = {
	type: "EAT";
	data: {
		eaterId: string;
		targetId: string;
	};
};
// Server sends the client
type LeaveMessage = {
	type: "LEAVE";
	data: {
		id: string;
	};
};
// Server sends the client
type SpawnMessage = {
	type: "SPAWN";
	data: {
		blob: BlobType;
	};
};
// Server sends the client
type DespawnMessage = {
	type: "DESPAWN";
	data: {
		blobId: string;
	};
};
// Server sends the client
type InitGame = {
	type: 'INIT_GAME',
	data: {
		blobs: BlobType[],
		otherPlayers: UserState[]
		selfPlayer: UserState
	}
}
// Server sends the client
type NewPlayerJoined = {
	type: "NEW_PLAYER",
	data: {
		player: UserState;
	}
}
// Server sends the client
type GameOver = {
	type: 'GAME_OVER',
}

export type GameMessage = JoinMessage | MoveMessage | EatMessage | LeaveMessage | SpawnMessage | DespawnMessage | InitGame | NewPlayerJoined | GameOver

export type BlobType = {
	color: string,
	foodRadius: number,
	blobX: number,
	blobY: number,
	blobId: string,
	classify: 'blob'
}


export type PlayerType = {
	id: string,
	color: string,
	playerRadius: number,
	playerX: number,
	playerY: number
}

export type serverGameState = {
	blobs: Record<string, BlobType>;
	Players: Record<string, PlayerType>;
};

export interface UserState {
	userId: string;
	username: string;
	classify: 'player'
	state: {
		radius: number;
		color?: string;
		pos: { x: number; y: number };
	};
}


export interface GameState {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	CANVAS_WIDTH: number;
	CANVAS_HEIGHT: number;
	mouseCoords: { x: number, y: number }
	cameraCoords: { x: number, y: number }
	currentZoom: number;
	// gameRunning: boolean;
	clientWS: WebSocket;
}

