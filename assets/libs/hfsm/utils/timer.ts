import { game } from "cc";

import { ITimer } from "./interface";

export class Timer implements ITimer {
  public startTime: number;

  public constructor() {
    this.startTime = game.totalTime;
  }

  public get elapsed() {
    return (game.totalTime - this.startTime) / 1000;
  }

  public get elapsedMs() {
    return game.totalTime - this.startTime;
  }

  public reset() {
    this.startTime = game.totalTime;
  }
}
