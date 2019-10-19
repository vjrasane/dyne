import process from "../core/process";
import { Updated } from "./update";
import { isFunction, exists, always } from "../../utils";

export type Init<M> = (flags: object) => Updated<M>;

export type Initializer<M> = (flags: object) => M;

export const getInitializer = <M>(init?: Init<M>): Initializer<M> => {
  if (!exists(init)) return always();
  if (!isFunction(init)) {
    throw new Error(`Given 'init' was not a function, was: ${typeof init}`);
  }
  return (flags: object): M => process(init(flags));
};
