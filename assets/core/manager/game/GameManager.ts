import { _decorator, Node } from "cc";

import BaseManager from "../../base/BaseManager";

const { ccclass } = _decorator;

@ccclass("GameManager")
export default class GameManager extends BaseManager {
  private _root: Node;

  constructor(root: Node) {
    super();

    this._root = root;
  }
}
