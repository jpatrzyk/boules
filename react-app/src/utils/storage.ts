import { openDB, DBSchema, IDBPDatabase, IDBPTransaction } from 'idb';

import { GameConditions, BaseState } from 'model/state';
import { HIGHEST_SCORES_LENGTH, INSTALL_PROMPT_INTERVAL_MS } from './constants';

export interface Score {
  playerName: string;
  score: number;
  timestamp: number;
}

export const CURRENT_GAME_KEY = 'CURRENT_GAME';
export const RECENT_PLAYER_KEY = 'RECENT_PLAYER_KEY';
export const PWA_LAST_INSTALL_PROMPT_DATE_KEY = 'PWA_LAST_INSTALL_PROMPT_DATE_KEY';

interface BoulesDB extends DBSchema {
  scores: {
    key: number;
    value: Score;
    indexes: { 'by-score': number };
  };
  currentGame: {
    key: typeof CURRENT_GAME_KEY;
    value: BaseState | GameConditions;
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

export const dbPromise = openDB<BoulesDB>('boules-1', 3, {
  async upgrade(db, oldVersion, newVersion, tx) {
    switch (oldVersion) {
      case 0: {
        const store = db.createObjectStore('scores', {
          keyPath: 'timestamp',
        });
        store.createIndex('by-score', 'score');
        (db as IDBPDatabase).createObjectStore('gameConditions');
        db.createObjectStore('savedGames');
        db.createObjectStore('recentPlayer');
      }
      // eslint-disable-next-line no-fallthrough
      case 1:
        db.createObjectStore('pwaLastInstallPromptDate');
      // eslint-disable-next-line no-fallthrough
      case 2: {
        db.createObjectStore('currentGame');
        const savedConditions = await (tx as IDBPTransaction).objectStore('gameConditions').getAll();
        if (savedConditions.length) {
          await tx.objectStore('currentGame').put(savedConditions[0], CURRENT_GAME_KEY);
        }
        (db as IDBPDatabase).deleteObjectStore('gameConditions');
      }
    }
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

export async function loadCurrentGame() {
  const db = await dbPromise;
  return db.get('currentGame', CURRENT_GAME_KEY);
}

export async function persistCurrentGame(value: BaseState) {
  const db = await dbPromise;
  return await db.put('currentGame', value, CURRENT_GAME_KEY);
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
