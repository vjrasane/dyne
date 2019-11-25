import { utils as U, types as T } from "dyne-commons";

export type View<M> = ((model: M) => T.VirtualDom) | T.VirtualDom;

export type Viewer<M> = (model: M) => T.VirtualDom;

export const getViewer = <M>(view: View<M>): Viewer<M> => {
  if (!U.exists(view)) {
    throw new Error(
      `Expected 'view' to be a function or element, was: '${typeof view}'`
    );
  }

  return U.isFunction(view) ? <Viewer<M>>view : (_: M) => <T.VirtualDom>view;
};
