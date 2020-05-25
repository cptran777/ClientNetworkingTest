export enum EventKey {
  w = 87,
  a = 65,
  s = 83,
  d = 68
}

export type Direction = 'up' | 'right' | 'left' | 'down';

export const keyToDirectionMap: Record<EventKey, Direction> = {
  [EventKey.w]: 'up',
  [EventKey.a]: 'left',
  [EventKey.s]: 'down',
  [EventKey.d]: 'right'
};

export const getDeltaFromDirection = (direction: Direction): number => {
  return direction === 'up' || direction === 'right' 
    ? 20
    : direction === 'left' || direction === 'down' ? -20 : 0;
}

export const getAxisFromDirection = (direction: Direction): 'x' | 'y' => {
  return direction === 'up' || direction === 'down' ? 'y' : 'x';
};
