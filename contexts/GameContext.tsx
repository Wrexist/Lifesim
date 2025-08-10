import { createContext, useContext } from 'react';
import { useGame } from '../src/store';
import type { GameState } from '../src/types';

const GameContext = createContext<GameState | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const state = useGame();
  return <GameContext.Provider value={state}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('GameContext missing');
  return ctx;
}

export default GameContext;
