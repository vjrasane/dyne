import { OpticalUpdate, Lens, Optical, Optic, toLens } from "./optical";
import { Update } from "./engine/core/update";
import { combine } from "./compose";

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
