import freeze from "deep-freeze";
import { exists } from "../utils";
import Return from "../effects/return";
import { Updated, Update } from "./update";
import { dispatch } from "../core/dispatch";

export default <A>(updated: Updated<A>, previous?: A): A => {
  const processed: Return<A> = Update.wrap(updated);
  processed.effects.forEach(dispatch);
  return exists(processed.model) ? freeze(processed.model) : previous;
};
