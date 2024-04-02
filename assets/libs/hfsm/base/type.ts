export type Action<T> = (data: T) => void;

export type Delegate = (...args: any[]) => void;

export type Func<T, V> = (transition: T) => V;
