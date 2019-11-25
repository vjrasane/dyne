import { utils as U } from "dyne-commons";
import process from "./process";
import { Updated } from "./update";
import { Dispatch } from "./dispatch";

export type Init<F, M> = ((flags: F) => Updated<M>) | Updated<M>;

export type Initializer<F, M> = (flags: F) => M;

export const getInitializer = <F, M>(
  dispatch: Dispatch,
  init?: Init<F, M>
): Initializer<F, M> => {
  const initial: (flags: F) => Updated<M> = U.isFunction(init)
    ? <Initializer<F, M>>init
    : (_: F) => <Updated<M>>init;
  return (flags: F): M => process(dispatch, initial(flags));
};
