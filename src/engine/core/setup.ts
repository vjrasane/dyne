import { types as T, utils as U } from "dyne-commons";
import getRenderer, { Renderer } from "../render";
import { getInitializer, Initializer, Init } from "./init";
import { getUpdater, Updater, Update } from "./update";
import { getViewer, View } from "./view";
import { Dispatch, Queues } from "./dispatch";

export type Setup<F, M> = {
  init?: Init<F, M>;
  update?: Update<M>;
  view: View<M>;
};

export type Opts<F> = {
  node: HTMLElement;
  flags?: F;
};

export const setup = <F, M>(
  dispatch: Dispatch,
  queues: Queues,
  { init, update, view }: Setup<F, M>
) => {
  const initializer: Initializer<F, M> = getInitializer(dispatch, init);
  const updater: Updater<M> = getUpdater(dispatch, update);
  const viewer: View<M> = getViewer(view);
  const renderer: Renderer = getRenderer(dispatch);

  return ({ node, flags }: Opts<F>) => {
    let model: M = initializer(flags);

    const updateProcedure = () => {
      if (queues.msg.length > 0) {
        model = updater(queues.msg.shift(), model);
      }
    };

    let viewedModel: M;
    let virtualDom: T.VirtualDom;
    const viewVirtualDom = () => {
      virtualDom = viewer(model) || [];
      viewedModel = model;
    };

    const viewProcedure = () => {
      if (!virtualDom || (U.exists(model) && model !== viewedModel)) {
        viewVirtualDom();
      }
    };

    let renderedVirtualDom;
    const renderProcedure = () => {
      if (U.exists(virtualDom) && virtualDom !== renderedVirtualDom) {
        renderer(node, virtualDom, renderedVirtualDom);
        renderedVirtualDom = virtualDom;
      }
    };

    const effectProcedure = () => {
      if (queues.effect.length > 0) {
        const effect = queues.effect.shift();
        // execute effect with the message dispatcher
        return effect.execute(dispatch);
      }
    };

    return {
      update: updateProcedure,
      view: viewProcedure,
      render: renderProcedure,
      effect: effectProcedure
    };
  };
};
