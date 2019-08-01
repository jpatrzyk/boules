import 'fake-indexeddb/auto';

import { HIGHEST_SCORES_LENGTH } from './constants';
import {
  dbPromise,
  isInTopScores,
  putScore,
  loadTopScoresDescending,
  clearAllScores,
} from './storage';

describe('isInTopScores', () => {
  beforeEach(async () => {
    const db = await dbPromise;
    await db.clear('scores');
  });

  it('should return true if too few stored scores', async () => {
    const db = await dbPromise;
    const timestamp = new Date(2019, 2, 14, 0, 0, 0, 0).getTime();
    await db.add('scores', { score: 100, playerName: 'A', timestamp });
    await db.add('scores', { score: 50, playerName: 'A', timestamp: timestamp + 100 });
    await db.add('scores', { score: 75, playerName: 'A', timestamp: timestamp + 200 });

    const result = await isInTopScores(5);
    expect(result).toBe(true);
  });

  it('should return false if score is 0', async () => {
    const result = await isInTopScores(0);
    expect(result).toBe(false);
  });

  it('should return true if score is high enough', async () => {
    const db = await dbPromise;
    const timestamp = new Date(2019, 2, 14, 0, 0, 0, 0).getTime();
    for (let i = 0; i < HIGHEST_SCORES_LENGTH; i++) {
      await db.add('scores', { score: 100 + i, playerName: 'A', timestamp: timestamp + i * 100 });
    }

    const result = await isInTopScores(101);
    expect(result).toBe(true);
  });

  it('should return false if score is not high enough', async () => {
    const db = await dbPromise;
    const timestamp = new Date(2019, 2, 14, 0, 0, 0, 0).getTime();
    for (let i = 0; i < HIGHEST_SCORES_LENGTH; i++) {
      await db.add('scores', { score: 100 + i, playerName: 'A', timestamp: timestamp + i * 100 });
    }

    const result = await isInTopScores(100); // equal to the last of the high scores
    expect(result).toBe(false);
  });
});

describe('putScore', () => {
  beforeEach(async () => {
    const db = await dbPromise;
    await db.clear('scores');
  });

  it('should add new score, even if score with the same value already exists', async () => {
    const db = await dbPromise;
    const timestamp = new Date(2019, 2, 14, 0, 0, 0, 0).getTime();
    await db.add('scores', { score: 100, playerName: 'A', timestamp });

    await putScore('Jane', 100);
    const allScores = await db.getAll('scores');
    expect(allScores).toHaveLength(2);
  });
});

describe('getAllScoresDescending', () => {
  beforeEach(async () => {
    const db = await dbPromise;
    await db.clear('scores');
  });

  it('should return only HIGHEST_SCORES_LENGTH top scores descending by score value', async () => {
    const db = await dbPromise;
    const timestamp = new Date(2019, 2, 14, 0, 0, 0, 0).getTime();
    const highestScore = 1000;
    for (let i = 0; i < HIGHEST_SCORES_LENGTH; i++) {
      await db.add('scores', { score: 100 + i, playerName: 'A', timestamp: timestamp + i * 23 });
    }
    await db.add('scores', { score: highestScore, playerName: 'A', timestamp: timestamp + 10000 });
    for (let i = 1; i < 5; i++) {
      await db.add('scores', { score: 200 + i, playerName: 'A', timestamp: timestamp + i * 37 });
    }

    const result = await loadTopScoresDescending();
    expect(result).toHaveLength(HIGHEST_SCORES_LENGTH);
    expect(result[0].score).toBe(highestScore);
    expect(result[1].score).toBeLessThanOrEqual(highestScore);
  });
});

describe('clearAllScores', () => {
  beforeEach(async () => {
    const db = await dbPromise;
    await db.clear('scores');
  });

  it('should remove all saved scores from the db', async () => {
    const db = await dbPromise;
    const timestamp = new Date(2019, 3, 16, 0, 0, 0, 0).getTime();
    await db.add('scores', { score: 33, playerName: 'A', timestamp });

    await clearAllScores();
    const allScores = await db.getAll('scores');
    expect(allScores).toHaveLength(0);
  });
});
