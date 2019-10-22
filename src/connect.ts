import { OpticalUpdate, Lens, Optical } from "./optical";
import { Update } from "./engine/core/update";
import { combine } from "./compose";

type Optic<P, C> = Lens<P, C> | string[] | string;

const toLens = <P, C>(optic: Optic<P, C>): Lens<P, C> => {
  if (typeof optic === "string") {
    return Lens.field(optic);
  } else if (Array.isArray(optic)) {
    return Lens.path(...optic);
  } else {
    return optic;
  }
};

const connector = <M>() => {
  const opticals: OpticalUpdate<M, any>[] = [];

  return {
    connect: <U>(optic: Optic<M, U>, inner: Update<U>): void => {
      opticals.push(Optical(toLens(optic), inner));
    },
    /**
     * Due to pass by reference and delayed evaluation,
     * any optical updates added by connect will be included
     * in the combined update function
     */
    update: combine(opticals)
  };
};

export default connector;
