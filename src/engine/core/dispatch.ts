import { types as T, utils as U } from "dyne-commons";
import Effect from "../effects/effect";

export type Dispatch = (msg: any) => void;

export type Queues = {
  msg: any[];
  effect: Effect<any>[];
};

const dispatcher = <A>(queue: A[], queueable: A): void => {
  U.exists(queueable) && queue.push(queueable);
};

export const msgEventListener = (
  listener: T.Generator<object>,
  dispatch: Dispatch
): T.Sink => (...args: any[]): void => dispatch(listener(...args));

export const getDispatcher = () => {
  const queues: Queues = {
    msg: [],
    effect: []
  };

  const dispatch: Dispatch = (queueable: Effect<any> | object): void =>
    queueable instanceof Effect
      ? dispatcher(queues.effect, queueable)
      : dispatcher(queues.msg, queueable);

  return {
    queues,
    dispatch
  };
};
