import type { Action, Delegate } from "../base/type";

export class ActionStorage<TEvent> {
  private _actions: Map<TEvent, Delegate> = new Map<TEvent, Delegate>();

  public add<TData>(trigger: TEvent, action: Action<TData>) {
    this._actions.set(trigger, action);
  }

  public run<TData>(trigger: TEvent, data: TData) {
    this._actions.get(trigger)?.(data);
  }
}
