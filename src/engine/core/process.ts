import { utils as U } from "dyne-commons";
import Return from "../effects/return";
import { Updated, Update } from "./update";
import { Dispatch } from "./dispatch";

export default <A>(
  dispatch: Dispatch,
  updated: Updated<A>,
  previous?: A
): A => {
  const processed: Return<A> = Update.wrap(updated);
  processed.effects.forEach(e => dispatch(e));
  return U.exists(processed.model) ? processed.model : previous;
};
