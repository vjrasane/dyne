import { utils as U } from "dyne-commons";
import { CmdFx, ProcessorF, PromiseableF, Processor, Failure } from "./types";
import Effect from "./effect";
import { Effectable } from "./return";
import { Dispatch } from "../core/dispatch";

export class Command<I, O> extends Effect<CmdFx<I>> {
  success: Processor<I, O>;
  failure: Failure<O>;

  constructor(cmd: CmdFx<I>, success?: Processor<I, O>, failure?: Failure<O>) {
    super(cmd);
    this.success = U.exists(success) ? success : U.identity;
    this.failure = U.exists(failure) ? failure : U.identity;
  }

  execute = (dispatch: Dispatch): Promise<void> =>
    processCommand(dispatch, this);
}

const processResult = (dispatch: Dispatch) => <I, O>(
  processor: Processor<I, O>,
  result: I
): void =>
  dispatch(
    U.isFunction(processor) ? (<ProcessorF<I, O>>processor)(result) : processor
  );

const processCommand = async <I, O>(
  dispatch: Dispatch,
  cmd: Command<I, O>
): Promise<void> => {
  const process: <I, O>(
    processor: Processor<I, O>,
    result: I
  ) => void = processResult(dispatch);

  try {
    const result = U.isFunction(cmd.effect)
      ? (<PromiseableF<I>>cmd.effect)()
      : cmd.effect;
    process(cmd.success, await result);
  } catch (error) {
    process(cmd.failure, error);
  }
};

export function Cmd<I, O>(
  cmd: CmdFx<I>,
  success?: Processor<I, O>,
  failure?: Failure<O>
): Command<I, O> {
  return new Command<I, O>(cmd, success, failure);
}

Cmd.wrap = <A>(wrappable: Effectable<A>): Effect<CmdFx<A>> => {
  if (wrappable instanceof Effect) {
    return wrappable;
  } else {
    return Cmd(wrappable);
  }
};
