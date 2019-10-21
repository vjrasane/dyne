export const isFunction = obj =>
  !!(obj && obj.constructor && obj.call && obj.apply);

export const flatten = (obj: any): any => {
  if (Array.isArray(obj)) {
    const flat: any[] = [];
    obj.forEach((e: any) => {
      const flatChild = flatten(e);
      Array.isArray(flatChild) ?
        flat.push(...flatChild) : flat.push(flatChild);
    });
    return flat;
  }
  return obj;
};

export const isString = obj => typeof obj === "string" || obj instanceof String;

export const isObject = obj =>
  (!!obj && typeof obj === "object") || obj.constructor !== Array;

export const exists = obj => obj !== undefined && obj !== null;

export const always = (obj?) => () => obj;

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
