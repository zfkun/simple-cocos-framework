import { EventKeyboard, Input, KeyCode, input } from "cc";

import { TransitionBase } from "../base/TransitionBase";
import { getCurrentFrame } from "../utils/frame";

const keyCache: {
  [name: string]: {
    [name: string]: number;
  };
} = {
  [Input.EventType.KEY_DOWN]: {},
  [Input.EventType.KEY_UP]: {},
  [Input.EventType.KEY_PRESSING]: {},
};

const getCache = (type: Input.EventType, code: KeyCode): number => {
  return keyCache[type]?.[code] || 0;
};

const setCache = (e: EventKeyboard) => {
  if (keyCache[e.type]) keyCache[e.type][e.keyCode] = getCurrentFrame();

  if (e.type === Input.EventType.KEY_UP) {
    delete keyCache[Input.EventType.KEY_PRESSING][e.keyCode];
  }
};

let inited = false;
const initCache = () => {
  if (inited) return;

  input.on(Input.EventType.KEY_DOWN, setCache);
  input.on(Input.EventType.KEY_UP, setCache);
  input.on(Input.EventType.KEY_PRESSING, setCache);
};

export class Down<TStateId> extends TransitionBase<TStateId> {
  private _keyCode: KeyCode;

  constructor(
    from: TStateId,
    to: TStateId,
    key: KeyCode,
    options?: {
      forceInstantly?: boolean;
    }
  ) {
    const { forceInstantly = false } = options || {};

    super(from, to, forceInstantly);

    this._keyCode = key;
  }

  public init(): void {
    initCache();
  }

  public shouldTransition(): boolean {
    return (
      getCache(Input.EventType.KEY_DOWN, this._keyCode) === getCurrentFrame()
    );
  }
}

export class Release<TStateId> extends TransitionBase<TStateId> {
  private _keyCode: KeyCode;

  constructor(
    from: TStateId,
    to: TStateId,
    key: KeyCode,
    options?: {
      forceInstantly?: boolean;
    }
  ) {
    const { forceInstantly = false } = options || {};

    super(from, to, forceInstantly);

    this._keyCode = key;
  }

  public init(): void {
    initCache();
  }

  public shouldTransition(): boolean {
    return (
      getCache(Input.EventType.KEY_UP, this._keyCode) === getCurrentFrame()
    );
  }
}

export class Press<TStateId> extends TransitionBase<TStateId> {
  private _keyCode: KeyCode;

  constructor(
    from: TStateId,
    to: TStateId,
    key: KeyCode,
    options?: {
      forceInstantly?: boolean;
    }
  ) {
    const { forceInstantly = false } = options || {};

    super(from, to, forceInstantly);

    this._keyCode = key;
  }

  public init(): void {
    initCache();
  }

  public shouldTransition(): boolean {
    return getCache(Input.EventType.KEY_UP, this._keyCode) > 0;
  }
}
