import { z } from 'zod'

export const AuthSchema = z.object({
	username: z.string().min(3, { message: 'Username must be atleast 3 letters long' }),
	password: z.string().min(5, { message: 'Password must be atleast 3 letters long' }),
})
export const JWT_SECRET = 'suleman123'

type JoinMessage = {
	type: "JOIN";
	data: {
		id: string;
		name: string;
		x: number;
		y: number;
		radius: number;
		color: string;
	};
};

type MoveMessage = {
	type: "MOVE";
	data: {
		id: string;
		x: number;
		y: number;
	};
};

type EatMessage = {
	type: "EAT";
	data: {
		eaterId: string;
		targetId: string;
	};
};

type LeaveMessage = {
	type: "LEAVE";
	data: {
		id: string;
	};
};

type SpawnMessage = {
	type: "SPAWN";
	data: {
		blobId: string;
		x: number;
		y: number;
		radius: number;
		color: string;
	};
};

type DespawnMessage = {
	type: "DESPAWN";
	data: {
		blobId: string;
	};
};


export type GameMessage = JoinMessage | MoveMessage | EatMessage | LeaveMessage | SpawnMessage | DespawnMessage

