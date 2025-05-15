import { Blob } from '@/game/Blob';
import { create } from 'zustand'

type ServerGameState = {
  clientBlobs: Map<string, Blob>;
  clientPlayers: Map<string, Blob>;
  selfBlob: Blob | undefined;
  hasGameStarted: boolean;
  renderCanvasFlag: boolean;
  setGameState: ( data: Partial<Pick<ServerGameState, 'hasGameStarted' | 'clientBlobs' | 'clientPlayers' | 'selfBlob' | 'renderCanvasFlag'>> ) => void;
};

export const useGameStore = create<ServerGameState>((set) => ({
  clientBlobs: new Map(),
  clientPlayers: new Map(),
  hasGameStarted: false,
  selfBlob: undefined,
  renderCanvasFlag: false,
  setGameState: (data) => set(data)
}));


interface UserStore {
  username: string;
  color: string;
  setUserStore: (data: Partial<Pick<UserStore, 'username' | 'color' >>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  username: 'suleman',
  color: '#282828',
  setUserStore: (data) => set(data)
}));
