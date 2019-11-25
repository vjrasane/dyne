import { Dispatch } from "../core/dispatch";

export type PromiseableF<A> = () => Promiseable<A>;

export type Promiseable<A> = Promise<A> | A;

export type CmdFx<A> = PromiseableF<A> | Promiseable<A>;

export type ProcessorF<I, O> = (res: I) => O;

export type Processor<I, O> = ProcessorF<I, O> | ((res: I) => I) | O;

export type Failure<O> = Processor<Error, O>;

export type Subscriber = (dispatch: Dispatch) => void;

export type Subscribe<A> = (dispatch: Dispatch) => A;

export type Canceller = () => void;

export type Cancel<A> = (sub: A) => void;
