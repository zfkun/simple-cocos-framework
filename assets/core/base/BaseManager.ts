import { _decorator, Component, EventTarget, js } from "cc";

const { ccclass } = _decorator;

export interface IManager {
  get managerName(): string;
  on(type: string | number, fn: (...any: any[]) => void, target: any): void;
  off(type: string | number, fn: (...any: any[]) => void, target: any): void;
  emit(type: string | number, ...data: any[]): void;
  once(type: string | number, fn: (...any: any[]) => void, target: any): void;
  targetOff(target: any): void;
}

@ccclass("BaseCompManager")
export class BaseCompManager extends Component implements IManager {
  private _event: EventTarget;

  private readonly _managerName: string = js.getClassName(this);
  public get managerName() {
    return this._managerName;
  }

  constructor() {
    super();
    this._event = new EventTarget();
  }

  on(type: string | number, fn: (...any: any[]) => void, target?: any) {
    this._event.on(type, fn, target);
  }
  off(type: string | number, fn: (...any: any[]) => void, target?: any) {
    this._event.off(type, fn, target);
  }
  emit(type: string | number, ...data: any[]) {
    this._event.emit(type, ...data);
  }
  once(type: string | number, fn: (...any: any[]) => void, target?: any) {
    this._event.once(type, fn, target);
  }
  targetOff(target: any) {
    this._event.targetOff(target);
  }
}

@ccclass("BaseManager")
export default class BaseManager implements IManager {
  private _event: EventTarget;

  private readonly _managerName: string = js.getClassName(this);
  public get managerName() {
    return this._managerName;
  }

  constructor() {
    this._event = new EventTarget();
  }

  on(type: string | number, fn: (...any: any[]) => void, target?: any) {
    this._event.on(type, fn, target);
  }
  off(type: string | number, fn: (...any: any[]) => void, target?: any) {
    this._event.off(type, fn, target);
  }
  emit(type: string | number, ...data: any[]) {
    this._event.emit(type, ...data);
  }
  once(type: string | number, fn: (...any: any[]) => void, target?: any) {
    this._event.once(type, fn, target);
  }
  targetOff(target: any) {
    this._event.targetOff(target);
  }
}
