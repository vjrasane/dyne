import { VirtualDom } from "dyne-commons";
import { utils } from "dyne-commons/build/index";

const { flatten } = utils;

/**
 * Fragments are simply array containers for their children
 */
export default (_: any, children: VirtualDom[]): VirtualDom =>
  flatten(children);
