import freeze from "deep-freeze";
import { isFunction, always } from "../../utils";
import { VirtualDom } from "../render";
import { exists } from "../../utils";

export type View<M> = (model: M) => VirtualDom | VirtualDom;

export type Viewer<M> = View<M>;

export const getViewer = <M>(view: View<M>): Viewer<M> => {
  if (!exists(view)) {
    throw new Error(
      `Expected 'view' to be a function or element, was: '${view}'`
    );
  } else if (isFunction(view)) {
    return model => freeze(view(model));
  } else {
    return always(freeze(view));
  }
};
