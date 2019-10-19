export const isFunction = obj =>
  !!(obj && obj.constructor && obj.call && obj.apply);

export const exists = obj => obj !== undefined && obj !== null;

export const always = (obj?) => () => obj;

export const throwError = (err: Error) => (): never => {
  throw err;
};

export type Generator<A> = (...args: any[]) => A;

export type Sink = Generator<void>;
