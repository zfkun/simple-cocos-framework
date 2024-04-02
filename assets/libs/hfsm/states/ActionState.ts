import type { Action } from "../base/type";
import type { IActionable } from "../base/interface";
import { StateBase } from "../base/StateBase";

import { ActionStorage } from "./ActionStorage";

export class ActionState<TStateId, TEvent>
  extends StateBase<TStateId>
  implements IActionable<TEvent>
{
  // Lazy initialized
  private _storage: ActionStorage<TEvent>;

  constructor(needsExitTime: boolean, isGhostState: boolean = false) {
    super(needsExitTime, isGhostState);
  }

  public add<TData>(
    trigger: TEvent,
    action: Action<TData>
  ): ActionState<TStateId, TEvent> {
    this._storage = this._storage || new ActionStorage<TEvent>();
    this._storage.add<TData>(trigger, action);
    return this;
  }

  public onAction<TData>(trigger: TEvent, data: TData) {
    this._storage?.run<TData>(trigger, data);
  }
}
