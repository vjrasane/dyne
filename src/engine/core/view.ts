import freeze from "deep-freeze";
import { isFunction, always } from "../utils";
import { isElement, DyneElement } from "../../element";

export type View<M> = (model: M) => DyneElement | DyneElement[];

export type Viewer<M> = View<M>;

export const getViewer = <M>(view: View<M>): Viewer<M> => {
  if (isElement(view)) {
    return always(freeze(view));
  } else if (isFunction(view)) {
    return model => freeze(view(model));
  } else {
    throw new Error(
      `Expected 'view' to be a function or element, was: '${typeof view}'`
    );
  }
};
