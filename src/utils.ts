import { DyneElement } from "./framework/dom";

export const isFunction = obj =>
  !!(obj && obj.constructor && obj.call && obj.apply);

export const flatten = (arr: any[]): any[] =>
  arr.reduce(
    (flat: any[], elem: any) =>
      flat.concat(Array.isArray(elem) ? flatten(elem) : elem),
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

export const isEventProp = (name: string): boolean => /^on/.test(name);

export const extractEventName = (name: string): string =>
  name.slice(2).toLowerCase();

// export const mapValues = (
//   obj: object,
//   mapper: (key: string, value: any) => any
// ) => {
//   const mappedObj = {};
//   Object.entries(obj).forEach(
//     ([key, value]) => (mappedObj[key] = mapper(key, value))
//   );
//   return mappedObj;
// };

export const putAt = (arr: any[], elem: any, index: number) => {
  const copy = [...arr];
  copy.splice(index, 0, elem);
  return copy;
};

export const replaceAt = (arr: any[], elem: any, index: number) => {
  const copy = [...arr];
  copy.splice(index, 1, elem);
  return copy;
};

export const removeAt = (arr: any[], index: number) => {
  const copy = [...arr];
  copy.splice(index, 1);
  return copy;
};

export const element = (type, props, children): DyneElement => ({
  type,
  props: props || {},
  children: children || []
});

export type Generator<A> = (...args: any[]) => A;

export type Sink = Generator<void>;
