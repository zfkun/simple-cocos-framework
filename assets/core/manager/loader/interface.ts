import { Asset, AssetManager, Constructor } from "cc";

export interface ILoadParams<T extends Asset> {
  bundleName?: string;
  dir?: string;
  paths?: string | String[];
  type?: Constructor<T> | null;
  onProgress?: (
    finished: number,
    total: number,
    item: AssetManager.RequestItem
  ) => void;
  onComplete?: (err: Error | null, res: T | T[]) => void;
}
