/**
 * 单例基类
 */
export default abstract class BaseSingleton {
  private static _instance: any = null;

  protected static getInstance<T>(type: new () => T) {
    if (this._instance === null) {
      this._instance = new type();
    }
    return this._instance;
  }
}
