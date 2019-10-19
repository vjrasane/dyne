import Effect from "./effect";
import { Generator, Sink } from "../utils";
import { Cmd, Command, msgEventListener } from "./command";
import { Dispatch } from "../core/dispatch";

type Subscriber = (dispatch: Dispatch) => void;

type Subscribe<A> = (dispatch: Dispatch) => A;

type Canceller = () => void;

type Cancel<A> = (sub: A) => void;

export class Subscription<A> extends Effect<Subscriber> {
  canceller: Canceller;

  constructor(subscriber: Subscriber, canceller: Canceller) {
    super(subscriber);
    this.canceller = canceller;
  }

  execute = (dispatch: Dispatch): void => this.effect(dispatch);
  cancel = (): Command<void> => Cmd((): void => this.canceller());
}

export const Sub = <A>(subscribe: Subscribe<A>, cancel: Cancel<A>) => {
  let sub: A;
  const subscriber: Subscriber = (dispatch: Dispatch): void => {
    sub = subscribe(dispatch);
  };
  const canceller: Canceller = (): void => cancel(sub);
  return new Subscription(subscriber, canceller);
};

Sub.interval = (
  effect: Effect<any> | object,
  duration: number
): Subscription<NodeJS.Timer> =>
  Sub(
    (dispatch: Dispatch): NodeJS.Timer =>
      setInterval((): void => dispatch(effect), duration),
    (interval: NodeJS.Timer): void => clearInterval(interval)
  );

Sub.listen = (trigger: string, effect: Generator<object>): Subscription<Sink> =>
  Sub(
    (dispatch: Dispatch): Sink => {
      const listener: Sink = msgEventListener(effect, dispatch);
      window.addEventListener(trigger, listener);
      return listener;
    },
    (listener: Sink): void => window.removeEventListener(trigger, listener)
  );
