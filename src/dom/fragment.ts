import { types, utils } from "dyne-commons";

/**
 * Fragments are simply array containers for their children
 */
export default (_: any, children: types.VirtualDom[]): types.VirtualDom =>
  utils.flatten(children || []);
