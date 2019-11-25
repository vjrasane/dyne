import { types as T } from "dyne-commons";
import { Setup, setup, Opts } from "./setup";
import { getDispatcher } from "./dispatch";

const UPDATE_INTERVAL = 1; /* milliseconds */
const VIEW_INTERVAL = 10; /* milliseconds */
const RENDER_INTERVAL = 10; /* milliseconds */
const EFFECT_INTERVAL = 1; /* milliseconds */

const intervals = {
  update: UPDATE_INTERVAL,
  view: VIEW_INTERVAL,
  render: RENDER_INTERVAL,
  effect: EFFECT_INTERVAL
};

export default <F, M>(setupObj: Setup<F, M>) => {
  const { dispatch, queues } = getDispatcher();
  const engine = setup(dispatch, queues, setupObj);
  return (opts: Opts<F>): void => {
    const procedures = engine(opts);
    Object.entries(procedures).forEach(([name, procedure]) =>
      setInterval(procedure, intervals[name])
    );
  };
};
