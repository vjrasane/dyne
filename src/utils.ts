export const isFunction = obj =>
  !!(obj && obj.constructor && obj.call && obj.apply);

export const flatten = (arr: any[]): any[] =>
  arr.reduce(
    (flat, elem) => flat.concat(Array.isArray(elem) ? flatten(elem) : elem),
    []
  );

export const isString = obj => typeof obj === "string" || obj instanceof String;

export const isObject = obj =>
  (!!obj && typeof obj === "object") || obj.constructor !== Array;

export const exists = obj => obj !== undefined && obj !== null;

export const always = (obj?) => () => obj;

export const identity = (obj?) => obj;

export const throwError = (err: Error) => (): never => {
  throw err;
};

export const element = (type, props, children) => ({
  type,
  props: props || [],
  children: children || []
});

export type Generator<A> = (...args: any[]) => A;

export type Sink = Generator<void>;
