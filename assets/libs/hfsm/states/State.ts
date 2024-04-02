import type { Action } from "../base/type";
import type { ITimer } from "../utils/interface";
import { Timer } from "../utils/timer";

import { ActionState } from "./ActionState";

export class State<TStateId, TEvent> extends ActionState<TStateId, TEvent> {
  private _onEnter: Action<State<TStateId, TEvent>>;
  private _onLogic: Action<State<TStateId, TEvent>>;
  private _onExit: Action<State<TStateId, TEvent>>;
  private _canExit: (state: State<TStateId, TEvent>) => boolean;

  public timer: ITimer;

  constructor(options?: {
    onEnter?: Action<State<TStateId, TEvent>>;
    onLogic?: Action<State<TStateId, TEvent>>;
    onExit?: Action<State<TStateId, TEvent>>;
    canExit?: (state: State<TStateId, TEvent>) => boolean;
    needsExitTime?: boolean;
    isGhostState?: boolean;
  }) {
    const {
      onEnter,
      onLogic,
      onExit,
      canExit,
      needsExitTime = false,
      isGhostState = false,
    } = options || {};

    super(needsExitTime, isGhostState);

    this._onEnter = onEnter;
    this._onLogic = onLogic;
    this._onExit = onExit;
    this._canExit = canExit;

    this.timer = new Timer();
  }

  public onEnter(): void {
    this.timer.reset();

    this._onEnter?.(this);
  }

  public onLogic(): void {
    if (
      this.needsExitTime &&
      this._canExit &&
      this.fsm.hasPendingTransition &&
      this._canExit(this)
    ) {
      this.fsm.stateCanExit();
    }

    this._onLogic?.(this);
  }

  public onExit(): void {
    this._onExit?.(this);
  }

  public onExitRequest() {
    if (this._canExit && this._canExit(this)) {
      this.fsm.stateCanExit();
    }
  }
}
