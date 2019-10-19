import { isFunction, throwError } from "../utils";
import Return from "../effects/return";
import Effect from "../effects/effect";
import process from "./process";

const throwUpdateError = (update: any): (() => never) =>
  throwError(
    new Error(
      `Attempted to pass message to 'update', but it was not a function, was: ${typeof update}`
    )
  );

export type Updated<A> = Return<A> | Effect<any> | A;

export type Updater<A> = (msg: object, model: A) => A;

export type Update<A> = (msg: object, model: A) => Updated<A>;

export const Update = <A>(model: A, ...effects: Effect<any>[]): Return<A> =>
  new Return(model, ...effects);

Update.wrap = <A>(wrappable: Updated<A>): Return<A> => {
  if (wrappable instanceof Return) {
    return wrappable;
  } else if (wrappable instanceof Effect) {
    return Update(null, wrappable);
  } else {
    return Update(wrappable);
  }
};

Update.compose = <A>(...updates: Updater<A>[]) => (
  msg: object,
  model: A
): Return<A> =>
  updates.reduce(
    // compose functions from LEFT to RIGHT
    (updated: Return<A>, update: Updater<A>): Return<A> =>
      // use bind (>>=) to combine the effects, but overwrite the model
      updated.bind(
        // wrap each returned value in update monad
        (m: A) => Update.wrap(update(msg, m))
      ),
    // Wrap the inital model in update monad
    Update(model)
  );

export const getUpdater = <M>(update: Update<M>): Updater<M> => {
  if (isFunction(update)) {
    return (msg: object, model: M) => process(update(msg, model), model);
  }
  return throwUpdateError(update);
};
