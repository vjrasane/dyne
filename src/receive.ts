import { OpticalUpdate, Lens, Optical, Optic, toLens } from "./optical";
import { Viewer } from "./engine/core/view";
import { combine } from "./compose";
import { DynamicElement, VirtualDom } from "./framework/dom";
import Dyne from "./";

type ReceiverElement = <M>(
  model: M,
  props: object,
  children: object[]
) => VirtualDom;

const receiver = <M>() => {
  let stored: M;
  return {
    receive: <U>(
      optic: Optic<M, U>,
      inner: ReceiverElement
    ): DynamicElement => {
      const lens = toLens(optic);
      return (props: object, children: object[]): VirtualDom =>
        inner(lens.get(stored), props, children);
    },

    view: (inner: Viewer<M>): Viewer<M> => (model: M): VirtualDom => {
      stored = model;
      return inner(stored);
    }
  };
};

export default receiver;
