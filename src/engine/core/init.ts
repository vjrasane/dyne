import process from "../core/process";
import { Updated } from "./update";
import { isFunction, exists, always } from "../../utils";

export type Init<F, M> = (flags: F) => Updated<M> | Updated<M>;

export type Initializer<F, M> = (flags: F) => M;

export const getInitializer = <F, M>(init?: Init<F, M>): Initializer<F, M> => {
  const initial: (flags: F) => Updated<M> = isFunction(init)
    ? init
    : always(init);
  return (flags: F): M => process(initial(flags));
};
