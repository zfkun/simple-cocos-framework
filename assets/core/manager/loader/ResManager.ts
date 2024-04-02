import {
  Asset,
  AssetManager,
  Constructor,
  _decorator,
  assetManager,
  error,
} from "cc";

import BaseManager from "../../base/BaseManager";
import type { ILoadParams } from "./interface";

const { ccclass } = _decorator;

const defaultBundleName = "resources";

@ccclass("ResManager")
export default class ResManager extends BaseManager {
  public loadRemote<T extends Asset>({
    url,
    ext,
    onComplete,
  }: {
    url: string;
    ext?: string;
    onComplete?: (err: Error | null, res: T) => void;
  }): void {
    if (ext) {
      assetManager.loadRemote<T>(url, { ext }, (err, res) => {
        if (err) {
          error(`[${this.managerName}] loadRemote fail: ${url}, ${ext}`);
        }
        onComplete && onComplete(err, res);
      });
      return;
    }

    assetManager.loadRemote<T>(url, (err, res) => {
      if (err) {
        error(`[${this.managerName}] loadRemote fail: ${url}`);
      }
      onComplete && onComplete(err, res);
    });
  }

  public loadRemoteAsync<T extends Asset>({
    url,
    ext,
  }: {
    url: string;
    ext?: string;
  }): Promise<T> {
    return new Promise((resolve) => {
      this.loadRemote<T>({
        url,
        ext,
        onComplete: (err: Error | null, res: T) => resolve(res),
      });
    });
  }

  public load<T extends Asset>(params: ILoadParams<T>): void {
    const { bundleName = defaultBundleName, onComplete = null } = params;

    if (assetManager.bundles.has(bundleName)) {
      this.loadByBundle(assetManager.bundles.get(bundleName), params);
      return;
    }

    assetManager.loadBundle(bundleName, (err, b) => {
      if (err) {
        // error(`[${this.managerName}] load bundle fail: ${bundleName}`);
        onComplete && onComplete(err, null);
      } else {
        this.loadByBundle(b, params);
      }
    });
  }

  public loadAsync<T extends Asset>(params: ILoadParams<T>): Promise<T | T[]> {
    return new Promise((resolve) => {
      params.onComplete = (err, res) => {
        if (err) {
          error(`[${this.managerName}] loadAsync fail: ${err.message}`);
        }
        resolve(res);
      };

      this.load<T>(params);
    });
  }

  public loadDir<T extends Asset>(params: ILoadParams<T>): void {
    const {
      dir,
      paths,
      bundleName = defaultBundleName,
      onComplete = null,
    } = params;

    if (!dir) {
      if (typeof paths !== "string") {
        onComplete && onComplete(new Error("dir and paths both invalid"), null);
        return;
      }

      params.dir = paths;
    }

    if (assetManager.bundles.has(bundleName)) {
      this.loadByBundle(assetManager.bundles.get(bundleName), params);
      return;
    }

    assetManager.loadBundle(bundleName, (err, b) => {
      if (err) {
        onComplete && onComplete(err, null);
      } else {
        this.loadByBundle(b, params);
      }
    });
  }

  public loadDirAsync<T extends Asset>(
    params: ILoadParams<T>
  ): Promise<T | T[]> {
    return new Promise((resolve) => {
      params.onComplete = (err, res) => {
        if (err) {
          error(`[${this.managerName}] loadDirAsync fail: ${err.message}`);
        }
        resolve(res);
      };

      this.loadDir<T>(params);
    });
  }

  private loadByBundle<T extends Asset>(
    bundle: AssetManager.Bundle,
    params: ILoadParams<T>
  ) {
    const {
      dir = null,
      paths = null,
      type = null,
      onProgress = null,
      onComplete = null,
    } = params;

    if (dir) {
      bundle.loadDir(dir, type, onComplete as (e: Error, res: T[]) => void);
    } else if (paths) {
      if (typeof paths === "string") {
        bundle.load(
          paths,
          type,
          onProgress,
          onComplete as (e: Error, res: T) => void
        );
      } else {
        bundle.load(
          paths as string[],
          type,
          onProgress,
          onComplete as (e: Error, res: T[]) => void
        );
      }
    }
  }

  public release(path: string, bundleName?: string): void {
    const asset = assetManager
      .getBundle(bundleName || defaultBundleName)
      ?.get(path);
    if (!asset) return;

    this._releasePrefab(asset);
  }

  public releaseDir(path: string, bundleName?: string): void {
    const bundle = assetManager.getBundle(bundleName || defaultBundleName);
    if (!bundle) return;

    bundle.getDirWithPath(path)?.map((info) => {
      this._releasePrefab(info.uuid);
    });

    if (!path && bundleName != "resources") {
      assetManager.removeBundle(bundle);
    }
  }

  private _releasePrefab(key: string | Asset) {
    if (key instanceof Asset) {
      key.decRef();
    } else {
      const asset = assetManager.assets.get(key);
      if (asset) {
        asset.decRef();
      }
    }
  }

  public get<T extends Asset>(
    path: string,
    type?: Constructor<T> | null,
    bundleName?: string
  ): T | null {
    return (
      assetManager
        .getBundle(bundleName || defaultBundleName)
        ?.get(path, type) || null
    );
  }
}
