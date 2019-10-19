import freeze from "deep-freeze";
import { isFunction, always } from "../../utils";
import { VirtualDom } from "../render";
import DyneElement from "../../element";

export type View<M> = (model: M) => VirtualDom;

export type Viewer<M> = View<M>;

export const getViewer = <M>(view: View<M>): Viewer<M> => {
  if (view instanceof DyneElement) {
    return always(freeze(view));
  } else if (isFunction(view)) {
    return model => freeze(view(model));
  } else {
    throw new Error(
      `Expected 'view' to be a function or element, was: '${typeof view}'`
    );
  }
};
