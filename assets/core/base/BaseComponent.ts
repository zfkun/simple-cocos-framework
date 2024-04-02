import { _decorator, Component } from "cc";
const { ccclass } = _decorator;

@ccclass("BaseComponent")
export default abstract class BaseComponent<T> extends Component {
  protected _params: T;

  init?(params: T): void {
    this._params = params;
    this.onInit?.();
  }

  protected onInit?(): void;
}
