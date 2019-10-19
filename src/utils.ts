export const isFunction = obj =>
  !!(obj && obj.constructor && obj.call && obj.apply);

export const flatten = arr => arr.flat(Infinity);

export const isString = obj => typeof obj === "string" || obj instanceof String;

export const exists = obj => obj !== undefined && obj !== null;

export const always = (obj?) => () => obj;

export const throwError = (err: Error) => (): never => {
  throw err;
};

export type Generator<A> = (...args: any[]) => A;

export type Sink = Generator<void>;