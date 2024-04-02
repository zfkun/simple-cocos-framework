import { IFactory } from "./factory";

export interface IPool<T> {
  /**
   * 预热缓存
   * @param size
   */
  prewarm(size: number);

  /**
   * 获取实例
   */
  get(): T;

  /**
   * 返还实例
   * @param member
   */
  put(member: T);

  /**
   * 缓存大小
   */
  size(): number;

  /**
   * 清空缓存
   */
  destroy();
}

/** 通用对象池 */
export class Pool<T> implements IPool<T> {
  private _stack: T[] = [];
  protected _factory: IFactory<T>;
  private _prewarmed: boolean = false;

  constructor(factory?: IFactory<T>) {
    if (factory) this._factory = factory;
  }

  prewarm(size: number) {
    if (!this._prewarmed) {
      for (let i = 0, n = size - this._stack.length; i < n; i++) {
        this._stack.push(this._factory.create());
      }
      this._prewarmed = true;
    }
  }

  get() {
    return this._stack.length > 0
      ? this._stack.shift()
      : this._factory.create();
  }

  put(member: T) {
    if (this._stack.indexOf(member) < 0) this._stack.push(member);
  }

  size(): number {
    return this._stack.length;
  }

  destroy() {
    this._stack.length = 0;
    this._prewarmed = false;
  }
}
