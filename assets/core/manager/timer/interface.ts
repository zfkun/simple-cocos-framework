export type TimerId = string | number;

export interface ITimer {
  set duration(val: number);
  set handler(val: Function);
  get elapsedTime(): number;
  get progress(): number;
  get isDone(): boolean;

  update(dt: number): void;
  reset(): void;
  stop(): void;
}

export interface ITimerData {
  id: TimerId;
  timer: ITimer;
  target: any;
  update?: (elapsedTime: number, progress: number) => void;
  complete?: Function;
}
