import { Blob } from '@/game/Blob';
import { BlobType, PlayerType, UserState } from '@repo/common/schema';
import { create } from 'zustand'

type ServerGameState = {
  blobs: BlobType[];
  clientBlobs: Blob[];
  Players: UserState[];
  clientPlayers: Map<string, Blob>;
  selfPlayer: UserState;
  selfBlob: Blob | undefined;
  hasGameStarted: boolean;
  setGameState: ( data: Partial<Pick<ServerGameState, 'blobs' | 'Players' | 'hasGameStarted' | 'selfPlayer' | 'clientBlobs' | 'clientPlayers' | 'selfBlob' >>) => void;
};

export const useGameStore = create<ServerGameState>((set) => ({
  blobs: [],
  clientBlobs: [],
  Players: [],
  clientPlayers: new Map(),
  hasGameStarted: false,
  selfPlayer: {
    username: '',
    userId: '',
    state: {
      pos: { x: 0, y: 0},
      radius: 0,
    }
  },
  selfBlob: undefined,
  setGameState: (data) => set(data)
}));


interface UserStore {
  username: string;
  color: string;
  setUserStore: (data: Partial<Pick<UserStore, 'username' | 'color'>>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  username: 'suleman',
  color: '#282828',
  setUserStore: (data) => set(data)
}));
