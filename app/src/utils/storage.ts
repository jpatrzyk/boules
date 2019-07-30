import { openDB, DBSchema } from 'idb';

import { HIGHEST_SCORES_LENGTH } from './constants';

interface BoulesDB extends DBSchema {
  scores: {
    key: string;
    value: {
      playerName: string;
      score: number;
      timestamp: number;
    };
    indexes: { 'by-score': number };
  };
}

export const dbPromise = openDB<BoulesDB>('boules-1', 1, {
  upgrade(db) {
    const store = db.createObjectStore('scores', {
      keyPath: 'timestamp',
    });
    store.createIndex('by-score', 'score');
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
  return db.add('scores', {
    playerName,
    score,
    timestamp: new Date().getTime(),
  });
}

export async function getAllScoresDescending() {
  const db = await dbPromise;
  const scoresAscending = await db.getAllFromIndex('scores', 'by-score');
  return scoresAscending.reverse();
}
