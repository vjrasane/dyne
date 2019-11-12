import { VirtualDom } from "./types";
import { flatten } from "./utils";

/**
 * Fragments are simply array containers for their children
 */
export default (_: any, children: VirtualDom[]): VirtualDom =>
  flatten(children);
