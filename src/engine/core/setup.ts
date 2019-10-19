import { renderer, VirtualDom } from "../render";
import { getInitializer, Initializer, Init } from "./init";
import { getUpdater, Updater, Update } from "./update";
import { getViewer, View, Viewer } from "./view";
import { dispatch, queues } from "./dispatch";

export type Setup<F, M> = {
  init: Init<F, M>;
  update: Update<M>;
  view: View<M>;
};

export type Opts<F> = {
  node: HTMLElement;
  flags: F;
};

export const setup = <F, M>({ init, update, view }: Setup<F, M>) => {
  const updater: Updater<M> = getUpdater(update);
  const viewer: Viewer<M> = getViewer(view);
  const initializer: Initializer<F, M> = getInitializer(init);

  return ({ node, flags }: Opts<F>) => {
    let model: M = initializer(flags);

    const updateProcedure = () => {
      if (queues.msg.length > 0) {
        model = updater(queues.msg.shift(), model);
      }
    };

    let viewedModel: M;
    let virtualDom: VirtualDom;
    const viewVirtualDom = () => {
      virtualDom = viewer(model);
      viewedModel = model;
    };

    // initial dom
    viewVirtualDom();
    const viewProcedure = () => {
      if (model && model !== viewedModel) {
        viewVirtualDom();
      }
    };

    let renderedVirtualDom;
    const renderProcedure = () => {
      if (virtualDom && virtualDom !== renderedVirtualDom) {
        renderer(node, virtualDom, renderedVirtualDom);
        renderedVirtualDom = virtualDom;
      }
    };

    const effectProcedure = () => {
      if (queues.effect.length > 0) {
        const effect = queues.effect.shift();
        // execute effect with the message dispatcher
        effect.execute(dispatch);
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