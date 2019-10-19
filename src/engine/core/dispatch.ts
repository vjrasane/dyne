import { exists } from "../utils";
import Effect from "../effects/effect";

export type Dispatch = (msg: object) => void;

type Queues = {
  msg: object[];
  effect: Effect<any>[];
};

export const queues: Queues = {
  msg: [],
  effect: []
};

const dispatcher = <A>(queue: A[], queueable: A): void => {
  exists(queueable) && queue.push(queueable);
};

export const dispatch = (queueable: Effect<any> | object): void => {
  queueable instanceof Effect
    ? dispatcher(queues.effect, queueable)
    : dispatcher(queues.msg, queueable);
};
