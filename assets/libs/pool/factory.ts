/**
 * 工厂 协议
 */
export interface IFactory<T> {
  create(): T;
}

/**
 * 构造器 工厂
 * 基于 `自定义函数` 生成
 */
export class CreatorFactory<T> implements IFactory<T> {
  private _creator: () => T;

  constructor(creator: () => T) {
    this._creator = creator;
  }

  create(): T {
    return this._creator();
  }
}

/**
 * 实例化 工厂
 * 基于 `类实例化` 生成
 */
export class ClassFactory<T> implements IFactory<T> {
  private _class: { new (): T };

  constructor(type: { new (): T }) {
    this._class = type;
  }

  create(): T {
    return new this._class();
  }
}
