import 'fake-indexeddb/auto';

import { BaseState } from 'model/state';
import { HIGHEST_SCORES_LENGTH } from './constants';
import {
  dbPromise,
  isInTopScores,
  putScore,
  loadTopScoresDescending,
  clearAllScores,
  loadSavedGamesNames,
  loadGame,
  persistGame,
  shouldShowInstallPrompt,
  persistLastInstallPromptDate,
  PWA_LAST_INSTALL_PROMPT_DATE_KEY,
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

describe('loadSavedGamesNames', () => {
  beforeEach(async () => {
    const db = await dbPromise;
    await db.clear('savedGames');
  });

  it('should return all saved games keys', async () => {
    const db = await dbPromise;
    const gameState: BaseState = {
      colorsCount: 5,
      showNextColors: true,
      size: 3,
      lineLength: 3,
      score: 28,
      model: [1, 2, 0, 0, 3, 5, 0, 4, 0],
      nextColors: [3, 3, 5],
    };
    await db.add('savedGames', gameState, 'game1');
    await db.add('savedGames', gameState, 'game2');
    await db.add('savedGames', gameState, 'game3');

    const names = await loadSavedGamesNames();
    expect(names).toHaveLength(3);
    expect(names).toEqual(expect.arrayContaining(['game1', 'game2', 'game3']));
  });
});

describe('loadGame', () => {
  beforeEach(async () => {
    const db = await dbPromise;
    await db.clear('savedGames');
  });

  it('should return savedGameByName', async () => {
    const db = await dbPromise;
    const gameState: BaseState = {
      colorsCount: 5,
      showNextColors: true,
      size: 3,
      lineLength: 3,
      score: 28,
      model: [1, 2, 0, 0, 3, 5, 0, 4, 0],
      nextColors: [3, 3, 5],
    };
    const otherGameState: BaseState = {
      colorsCount: 7,
      showNextColors: false,
      size: 3,
      lineLength: 3,
      score: 76,
      model: [0, 7, 1, 0, 2, 0, 3, 4, 0],
      nextColors: [1, 4, 6],
    };
    await db.add('savedGames', gameState, 'expected_game');
    await db.add('savedGames', otherGameState, 'other1');
    await db.add('savedGames', otherGameState, 'other2');

    const game = await loadGame('expected_game');
    expect(game).toEqual(gameState);
  });
});

describe('persistGame', () => {
  beforeEach(async () => {
    const db = await dbPromise;
    await db.clear('savedGames');
  });

  it('should put game state into db with name as the key', async () => {
    const db = await dbPromise;
    const gameState: BaseState = {
      colorsCount: 5,
      showNextColors: true,
      size: 3,
      lineLength: 3,
      score: 28,
      model: [1, 2, 0, 0, 3, 5, 0, 4, 0],
      nextColors: [3, 3, 5],
    };

    const key = await persistGame('test_game', gameState);

    const persisted = await db.get('savedGames', key);
    expect(key).toEqual('test_game');
    expect(persisted).toEqual(gameState);
  });
});

describe('shouldShowInstallPrompt', () => {
  beforeEach(async () => {
    const db = await dbPromise;
    await db.clear('pwaLastInstallPromptDate');
  });

  it('should return true if no date stored', async () => {
    const result = await shouldShowInstallPrompt(1);
    expect(result).toBe(true);
  });

  it('should return false if delay has not been reached', async () => {
    const db = await dbPromise;
    const now = Date.now();
    await db.put('pwaLastInstallPromptDate', now, PWA_LAST_INSTALL_PROMPT_DATE_KEY);

    const result = await shouldShowInstallPrompt(10 * 1000); // ten seconds
    expect(result).toBe(false);
  });

  it('should return true if delay has exceeded', async () => {
    const db = await dbPromise;
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    await db.put('pwaLastInstallPromptDate', tenMinutesAgo, PWA_LAST_INSTALL_PROMPT_DATE_KEY);

    const result = await shouldShowInstallPrompt(10 * 1000); // ten seconds
    expect(result).toBe(true);
  });
});

describe('persistLastInstallPromptDate', () => {
  beforeEach(async () => {
    const db = await dbPromise;
    await db.clear('pwaLastInstallPromptDate');
  });

  it('should put given timestamp in millis into the db', async () => {
    const timestamp = Date.now();
    await persistLastInstallPromptDate(timestamp);

    const db = await dbPromise;
    const persisted = await db.get('pwaLastInstallPromptDate', PWA_LAST_INSTALL_PROMPT_DATE_KEY);
    expect(persisted).toEqual(timestamp);
  });
});
