import { EventTarget, _decorator, warn } from "cc";

import BaseManager from "../../base/BaseManager";
import type { EventId } from "./types";

const { ccclass } = _decorator;

@ccclass("EventManager")
export default class EventManager extends BaseManager {
  private _events: { [id: EventId]: EventTarget } = {};

  public get(id: EventId) {
    if (this._events[id]) return this._events[id];

    const event = new EventTarget();
    this._events[id] = event;

    return event;
  }

  public remove(id: EventId) {
    if (this._events[id]) {
      delete this._events[id];
    }
  }

  public clear() {
    this._events = {};
  }
}
