import process from "../core/process";
import { Updated } from "./update";
import { isFunction, exists, always } from "../../utils";

export type Init<F, M> = (flags: F) => Updated<M>;

export type Initializer<F, M> = (flags: F) => M;

export const getInitializer = <F, M>(init?: Init<F, M>): Initializer<F, M> => {
  if (!exists(init)) return always();
  if (!isFunction(init)) {
    throw new Error(`Given 'init' was not a function, was: ${typeof init}`);
  }
  return (flags: F): M => process(init(flags));
};
