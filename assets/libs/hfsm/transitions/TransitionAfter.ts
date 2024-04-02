import type { Action, Func } from "../base/type";
import type { ITimer } from "../utils/interface";

import { TransitionBase } from "../base/TransitionBase";
import { Timer } from "../utils/timer";

export class TransitionAfter<TStateId> extends TransitionBase<TStateId> {
  public delay: number;
  public timer: ITimer;

  private _condition: Func<TransitionAfter<TStateId>, boolean>;
  private _beforeTransition: Action<TransitionAfter<TStateId>>;
  private _afterTransition: Action<TransitionAfter<TStateId>>;

  constructor(
    from: TStateId,
    to: TStateId,
    delay: number,
    options?: {
      condition?: Func<TransitionAfter<TStateId>, boolean>;
      onTransition?: Action<TransitionAfter<TStateId>>;
      afterTransition?: Action<TransitionAfter<TStateId>>;
      forceInstantly?: boolean;
    }
  ) {
    const {
      condition,
      onTransition,
      afterTransition,
      forceInstantly = false,
    } = options || {};

    super(from, to, forceInstantly);

    this.delay = delay;

    this._condition = condition;
    this._beforeTransition = onTransition;
    this._afterTransition = afterTransition;

    this.timer = new Timer();
  }

  public onEnter(): void {
    this.timer.reset();
  }

  public shouldTransition(): boolean {
    if (this.timer.elapsed < this.delay) return false;

    if (!this._condition) return true;

    return this._condition(this);
  }

  public beforeTransition() {
    return this._beforeTransition?.(this);
  }
  public afterTransition() {
    return this._afterTransition?.(this);
  }
}
