export const isFunction = obj =>
  !!(obj && obj.constructor && obj.call && obj.apply);

export const flatten = arr => arr.flat(Infinity);

export const isString = obj => typeof obj === "string" || obj instanceof String;
