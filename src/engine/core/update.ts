import { utils as U } from "dyne-commons";
import Return, { Effectable } from "../effects/return";
import Effect from "../effects/effect";
import { CmdFx } from "../effects/types";
import process from "./process";
import { Dispatch } from "./dispatch";

const throwUpdateError = (update: any): (() => never) =>
  U.throwError(
    new Error(
      `Attempted to pass message to 'update', but it was not a function, was: ${typeof update}`
    )
  );

export type Updated<A> = Return<A> | Effect<any> | CmdFx<A> | A;

export type Updater<A> = (msg: object, model: A) => A;

export type Update<A> = (msg: object, model: A) => Updated<A>;

export const Update = <A>(model: A, ...effects: Effectable<any>[]): Return<A> =>
  new Return(model, ...effects);

Update.wrap = <A>(wrappable: Updated<A>): Return<A> => {
  if (wrappable instanceof Return) {
    return wrappable;
  } else if (
    U.isFunction(wrappable) ||
    wrappable instanceof Promise ||
    wrappable instanceof Effect
  ) {
    return Update(null, wrappable);
  } else {
    return Update(<A>wrappable);
  }
};

export const getUpdater = <M>(
  dispatch: Dispatch,
  update: Update<M>
): Updater<M> => {
  if (U.isFunction(update)) {
    return (msg: object, model: M) =>
      process(dispatch, update(msg, model), model);
  }
  return throwUpdateError(update);
};
