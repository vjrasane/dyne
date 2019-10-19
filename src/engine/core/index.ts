import { Setup, setup, Opts } from "./setup";
import { Sink } from "../../utils";

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

const loop = (procedure: Sink, interval: number): void => {
  let lock = false;
  setInterval((): void => {
    if (!lock) {
      lock = true;
      procedure();
      lock = false;
    }
  }, interval);
};

export default <M>(setupObj: Setup<M>) => {
  const engine = setup(setupObj);
  return (opts: Opts): void => {
    const procedures = engine(opts);
    Object.entries(procedures).forEach(([name, procedure]) =>
      loop(procedure, intervals[name])
    );
  };
};
