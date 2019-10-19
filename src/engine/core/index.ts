import { renderer, VirtualDom } from "../render";
import { getInitializer, Initializer, Init } from "../core/init";
import { getUpdater, Updater, Update } from "../core/update";
import { getViewer, View, Viewer } from "../core/view";
import { dispatch, queues } from "../core/dispatch";
import { Sink } from "../../utils";

const UPDATE_INTERVAL = 1; /* milliseconds */
const VIEW_INTERVAL = 10; /* milliseconds */
const RENDER_INTERVAL = 10; /* milliseconds */
const EFFECT_INTERVAL = 1; /* milliseconds */

const loop = (procedure: Sink, interval: number): void => {
  let lock = false;
  setInterval((): void => {
    if (!lock) {
      lock = true;
      procedure();
      lock = false;
    }
  }, interval);
};

type Setup<M> = {
  init: Init<M>;
  update: Update<M>;
  view: View<M>;
};

const engine = <M>({ init, update, view }: Setup<M>) => {
  const updater: Updater<M> = getUpdater(update);
  const viewer: Viewer<M> = getViewer(view);
  const initializer: Initializer<M> = getInitializer(init);

  return ({ node, flags }) => {
    let model: M = initializer(flags);

    // update loop
    loop(() => {
      if (queues.msg.length > 0) {
        model = updater(queues.msg.shift(), model);
      }
    }, UPDATE_INTERVAL);

    // view loop
    let initialRender: Boolean = false;
    let viewedModel: M;
    let virtualDom: VirtualDom;
    const render = () => {
      virtualDom = viewer(model);
      viewedModel = model;
    };

    loop(() => {
      if (!initialRender) {
        render();
        initialRender = true;
      } else if (model && model !== viewedModel) {
        render();
      }
    }, VIEW_INTERVAL);

    // render loop
    let renderedVirtualDom;
    loop(() => {
      if (virtualDom && virtualDom !== renderedVirtualDom) {
        renderer(node, virtualDom, renderedVirtualDom);
        renderedVirtualDom = virtualDom;
      }
    }, RENDER_INTERVAL);

    // effect loop
    loop(() => {
      if (queues.effect.length > 0) {
        const effect = queues.effect.shift();
        // execute effect with the message dispatcher
        effect.execute(dispatch);
      }
    }, EFFECT_INTERVAL);
  };
};

export default engine;
