import { openDB, DBSchema } from 'idb';

import { GameConditions, BaseState } from 'model/state';
import { HIGHEST_SCORES_LENGTH, INSTALL_PROMPT_INTERVAL_MS } from './constants';

export interface Score {
  playerName: string;
  score: number;
  timestamp: number;
}

export const GAME_CONDITIONS_KEY = 'GAME_CONDITIONS';
export const RECENT_PLAYER_KEY = 'RECENT_PLAYER_KEY';
export const PWA_LAST_INSTALL_PROMPT_DATE_KEY = 'PWA_LAST_INSTALL_PROMPT_DATE_KEY';

interface BoulesDB extends DBSchema {
  scores: {
    key: number;
    value: Score;
    indexes: { 'by-score': number };
  };
  gameConditions: {
    key: typeof GAME_CONDITIONS_KEY;
    value: GameConditions;
  };
  savedGames: {
    key: string;
    value: BaseState;
  };
  recentPlayer: {
    key: typeof RECENT_PLAYER_KEY;
    value: string;
  };
  pwaLastInstallPromptDate: {
    key: typeof PWA_LAST_INSTALL_PROMPT_DATE_KEY;
    value: number;
  };
}

export const dbPromise = openDB<BoulesDB>('boules-1', 1, {
  upgrade(db) {
    const store = db.createObjectStore('scores', {
      keyPath: 'timestamp',
    });
    store.createIndex('by-score', 'score');
    db.createObjectStore('gameConditions');
    db.createObjectStore('savedGames');
    db.createObjectStore('recentPlayer');
    db.createObjectStore('pwaLastInstallPromptDate');
  },
});

export async function isInTopScores(score: number) {
  if (score <= 0) {
    return false;
  }
  const db = await dbPromise;
  const higherOrEqualScores = await db.getAllFromIndex(
    'scores',
    'by-score',
    IDBKeyRange.lowerBound(score),
    HIGHEST_SCORES_LENGTH,
  );
  return higherOrEqualScores.length < HIGHEST_SCORES_LENGTH;
}

export async function putScore(playerName: string, score: number) {
  const db = await dbPromise;
  const tx = db.transaction(['scores', 'recentPlayer'], 'readwrite');
  tx.objectStore('scores').add({
    playerName,
    score,
    timestamp: new Date().getTime(),
  });
  tx.objectStore('recentPlayer').put(playerName, RECENT_PLAYER_KEY);
  await tx.done;
}

export async function loadTopScoresDescending(): Promise<Score[]> {
  const db = await dbPromise;
  const scoresAscending = await db.getAllFromIndex('scores', 'by-score');
  return scoresAscending.reverse().slice(0, HIGHEST_SCORES_LENGTH);
}

export async function clearAllScores() {
  const db = await dbPromise;
  await db.clear('scores');
}

export async function loadGameConditions() {
  const db = await dbPromise;
  return db.get('gameConditions', GAME_CONDITIONS_KEY);
}

export async function persistGameConditions(value: GameConditions) {
  const db = await dbPromise;
  return await db.put('gameConditions', value, GAME_CONDITIONS_KEY);
}

export async function loadSavedGamesNames() {
  const db = await dbPromise;
  return db.getAllKeys('savedGames');
}

export async function loadGame(name: string) {
  const db = await dbPromise;
  return await db.get('savedGames', name);
}

export async function persistGame(name: string, state: BaseState) {
  const db = await dbPromise;
  return await db.put('savedGames', state, name);
}

export async function clearAllSavedGames() {
  const db = await dbPromise;
  await db.clear('savedGames');
}

export async function loadRecentPlayerName() {
  const db = await dbPromise;
  return await db.get('recentPlayer', RECENT_PLAYER_KEY);
}

export async function shouldShowInstallPrompt(delay: number = INSTALL_PROMPT_INTERVAL_MS) {
  const db = await dbPromise;
  const lastPromptDate = await db.get('pwaLastInstallPromptDate', PWA_LAST_INSTALL_PROMPT_DATE_KEY);
  return !lastPromptDate || lastPromptDate + delay < Date.now();
}

export async function persistLastInstallPromptDate(timestampMillis: number) {
  const db = await dbPromise;
  return await db.put(
    'pwaLastInstallPromptDate',
    timestampMillis,
    PWA_LAST_INSTALL_PROMPT_DATE_KEY,
  );
}
