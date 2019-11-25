import Effect from "./effect";
import { types as T } from "dyne-commons";
import { Cmd, Command } from "./command";
import { Dispatch, msgEventListener } from "../core/dispatch";
import { Subscriber, Canceller, Subscribe, Cancel } from "./types";

export class Subscription extends Effect<Subscriber> {
  canceller: Canceller;

  constructor(subscriber: Subscriber, canceller: Canceller) {
    super(subscriber);
    this.canceller = canceller;
  }

  execute = (dispatch: Dispatch): void => this.effect(dispatch);
  cancel = (): Command<void, void> => Cmd(this.canceller);
}

export const Sub = <A>(subscribe: Subscribe<A>, cancel: Cancel<A>) => {
  let sub: A;
  const subscriber: Subscriber = (dispatch: Dispatch): void => {
    sub = subscribe(dispatch);
  };
  const canceller: Canceller = (): void => cancel(sub);
  return new Subscription(subscriber, canceller);
};

Sub.interval = <A>(effect: Effect<A> | A, duration: number): Subscription =>
  Sub(
    (dispatch: Dispatch): NodeJS.Timer =>
      setInterval((): void => dispatch(effect), duration),
    (interval: NodeJS.Timer): void => clearInterval(interval)
  );

Sub.listen = (trigger: string, effect: T.Generator<object>): Subscription =>
  Sub(
    (dispatch: Dispatch): T.Sink => {
      const listener: T.Sink = msgEventListener(effect, dispatch);
      window.addEventListener(trigger, listener);
      return listener;
    },
    (listener: T.Sink): void => window.removeEventListener(trigger, listener)
  );
