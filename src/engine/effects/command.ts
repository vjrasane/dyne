import { isFunction, Generator, Sink } from "../../utils";
import Effect from "./effect";
import { Dispatch } from "../core/dispatch";

type Promiseable<A> = Promise<A> | A;

type CmdFx<A> = () => Promiseable<A>;

type Processor<A> = (res: A) => object | object;

type Failure = Processor<Error>;

export class Command<A> extends Effect<CmdFx<A>> {
  success: Processor<A>;
  failure: Failure;

  constructor(cmd: CmdFx<A>, success?: Processor<A>, failure?: Failure) {
    super(cmd);
    this.success = success;
    this.failure = failure;
  }

  execute(dispatch: Dispatch) {
    processCommand(this, dispatch);
  }
}

class Result extends Command<object> {
  constructor(result) {
    super(result);
  }

  execute(dispatch: (msg: object) => void) {
    dispatch(this.effect);
  }
}

export function Cmd<A>(
  cmd: CmdFx<A>,
  success?: Processor<A>,
  failure?: Failure
): Command<A> {
  return new Command<A>(cmd, success, failure);
}

Cmd.result = (result: object): Command<object> => new Result(result);

const processResult = (dispatch: Dispatch) => <A>(
  processor: Processor<A>,
  result: A
): void => dispatch(isFunction(processor) ? processor(result) : processor);

export const processCommand = async <A>(
  cmd: Command<A>,
  dispatch: Dispatch
) => {
  const process: <A>(
    processor: Processor<A>,
    result: A
  ) => void = processResult(dispatch);

  try {
    process(cmd.success, await cmd.effect());
  } catch (error) {
    process(cmd.failure, error);
  }
};
