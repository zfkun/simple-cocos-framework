import type { Action, Func } from "../base/type";
import type { ITimer } from "../utils/interface";

import { TransitionBase } from "../base/TransitionBase";
import { Timer } from "../utils/timer";

export class TransitionAfterDynamic<TStateId> extends TransitionBase<TStateId> {
  private _delay: number;
  public timer: ITimer;
  public onlyEvaluateDelayOnEnter: boolean;
  public delayCalculator: Func<TransitionAfterDynamic<TStateId>, number>;

  private _condition: Func<TransitionAfterDynamic<TStateId>, boolean>;
  private _beforeTransition: Action<TransitionAfterDynamic<TStateId>>;
  private _afterTransition: Action<TransitionAfterDynamic<TStateId>>;

  constructor(
    from: TStateId,
    to: TStateId,
    delay: Func<TransitionAfterDynamic<TStateId>, number>,
    options?: {
      condition?: Func<TransitionAfterDynamic<TStateId>, boolean>;
      onTransition?: Action<TransitionAfterDynamic<TStateId>>;
      afterTransition?: Action<TransitionAfterDynamic<TStateId>>;
      forceInstantly?: boolean;
      onlyEvaluateDelayOnEnter?: boolean;
    }
  ) {
    const {
      condition,
      onTransition,
      afterTransition,
      forceInstantly = false,
      onlyEvaluateDelayOnEnter = false,
    } = options || {};

    super(from, to, forceInstantly);

    this.delayCalculator = delay;
    this.onlyEvaluateDelayOnEnter = onlyEvaluateDelayOnEnter;

    this._condition = condition;
    this._beforeTransition = onTransition;
    this._afterTransition = afterTransition;

    this.timer = new Timer();
  }

  public onEnter(): void {
    this.timer.reset();

    if (this.onlyEvaluateDelayOnEnter) {
      this._delay = this.delayCalculator(this);
    }
  }

  public shouldTransition(): boolean {
    if (!this.onlyEvaluateDelayOnEnter) {
      this._delay = this.delayCalculator(this);
    }

    if (this.timer.elapsed < this._delay) return false;

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
