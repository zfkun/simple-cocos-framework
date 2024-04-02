import { ITimer } from "./interface";

export default class Timer implements ITimer {
  private _duration: number = -1;
  private _elapsedTime: number = 0;
  private _handler?: Function;
  private _isDone: boolean = false;

  constructor(duration: number, handler?: Function) {
    this._duration = duration;
    this._handler = handler;
  }

  public set duration(val: number) {
    this._duration = val;
    this._elapsedTime = 0;
  }

  public set handler(val: Function | undefined | null) {
    this._handler = val;
  }

  public get isDone(): boolean {
    return this._isDone;
  }

  public get elapsedTime(): number {
    return this._elapsedTime;
  }

  public get progress(): number {
    return this._duration <= 0
      ? 0
      : Math.min(1, this._elapsedTime / this._duration);
  }

  public update(dt: number): void {
    if (this._duration < 0) return;

    this._elapsedTime += dt;

    this._isDone = this._elapsedTime >= this._duration;
    this._isDone && this._handler && this._handler();
  }

  public reset() {
    this._elapsedTime = 0;
    this._isDone = false;
  }

  public stop() {
    this._elapsedTime = 0;
    this._duration = -1;
    this._isDone = false;
    this._handler = null;
  }
}
