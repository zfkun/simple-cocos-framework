import type { Action, Func } from "../base/type";
import { TransitionBase } from "../base/TransitionBase";

export class Transition<TStateId> extends TransitionBase<TStateId> {
  private _condition: Func<Transition<TStateId>, boolean>;
  private _beforeTransition: Action<Transition<TStateId>>;
  private _afterTransition: Action<Transition<TStateId>>;

  constructor(
    from: TStateId,
    to: TStateId,
    options?: {
      condition?: Func<Transition<TStateId>, boolean>;
      onTransition?: Action<Transition<TStateId>>;
      afterTransition?: Action<Transition<TStateId>>;
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

    this._condition = condition;
    this._beforeTransition = onTransition;
    this._afterTransition = afterTransition;
  }

  public shouldTransition(): boolean {
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
