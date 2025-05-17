import { Blob } from '@/game/Blob';
import { generateRandomColor } from '@repo/common/schema';
import randomName from '@scaleway/random-name';
import { create } from 'zustand'

type ServerGameState = {
  clientBlobs: Map<string, Blob>;
  clientPlayers: Map<string, Blob>;
  selfBlob: Blob | undefined;
  hasGameStarted: boolean;
  serverConnectionMade: boolean;
  setGameState: ( data: Partial<Pick<ServerGameState, 'hasGameStarted' | 'clientBlobs' | 'clientPlayers' | 'selfBlob' | 'serverConnectionMade' >> ) => void;
};

export const useGameStore = create<ServerGameState>((set) => ({
  clientBlobs: new Map(),
  clientPlayers: new Map(),
  hasGameStarted: false,
  selfBlob: undefined,
  serverConnectionMade: false,
  setGameState: (data) => set(data)
}));


interface UserStore {
  username: string;
  color: string;
  setUserStore: (data: Partial<Pick<UserStore, 'username' | 'color' >>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  username: randomName(),
  color: generateRandomColor(),
  setUserStore: (data) => set(data)
}));
