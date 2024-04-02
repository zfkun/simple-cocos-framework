import { _decorator } from "cc";

import type { ITimerData, TimerId } from "./interface";
import Timer from "./Timer";
import { BaseCompManager } from "../../base/BaseManager";

const { ccclass } = _decorator;

@ccclass("TimerManager")
export default class TimerManager extends BaseCompManager {
  private _timers: { [id: TimerId]: ITimerData } = {};
  private _timerId: number = 0;

  protected update(dt: number): void {
    for (const id in this._timers) {
      const data = this._timers[id];

      data.timer.update(dt);

      if (data.timer.isDone) {
        this.onTimerComplete(data);
      } else {
        this.onTimerUpdate(data);
      }
    }
  }

  private onTimerUpdate(data: ITimerData) {
    data.update &&
      data.update.call(
        data.target,
        data.timer.elapsedTime,
        data.timer.progress
      );
  }

  private onTimerComplete(data: ITimerData) {
    data.complete && data.complete.call(data.target);
    delete this._timers[data.id];
  }

  public add(
    target: any,
    duration: number,
    complete?: Function,
    update?: (elapsedTime: number, progress: number) => void
  ): TimerId {
    const data: ITimerData = {
      id: ++this._timerId,
      timer: new Timer(duration),
      target,
      update,
      complete,
    };

    this._timers[data.id] = data;

    return data.id;
  }

  public remove(id: TimerId) {
    if (this._timers[id]) {
      this._timers[id].timer.stop();
      delete this._timers[id];
    }
  }
}
