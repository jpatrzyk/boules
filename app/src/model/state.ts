export interface GameConditions {
  colorsCount: number;
  showNextColors: boolean;
}

export interface BaseState extends GameConditions {
  size: number;
  lineLength: number;
  score: number;
  model: number[];
  nextColors: number[];
}

export enum StateType {
  Initial = 'initial',
  Waiting = 'waiting_for_click',
  Moving = 'moving_selected_ball',
  Adding = 'adding_new_balls',
  Freeing = 'freeing_full_row',
}

export interface InitialState extends BaseState {
  type: StateType.Initial;
}

export interface WaitingState extends BaseState {
  type: StateType.Waiting;
  selectedBall: number; // -1 means no selection
}

export interface MovingState extends BaseState {
  type: StateType.Moving;
  selectedBall: number;
  remainingPath: number[];
}

export interface AddingState extends BaseState {
  type: StateType.Adding;
  positionsToFill: { [position: number]: number };
}

export interface FreeingState extends BaseState {
  type: StateType.Freeing;
  ballsToRemove: number[];
}

export type State = InitialState | WaitingState | MovingState | AddingState | FreeingState;

export type BoardAction =
  | { type: 'board_clicked'; position: number }
  | { type: 'animation_finished' }
  | { type: 'new_game'; options?: GameConditions };

export function boardClicked(position: number): BoardAction {
  return { type: 'board_clicked', position };
}

export function animationFinished(): BoardAction {
  return { type: 'animation_finished' };
}

export function newGame(options?: GameConditions): BoardAction {
  return { type: 'new_game', options };
}
