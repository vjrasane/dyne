import { Update, Updated } from "./engine/core/update";
import Return from "./engine/effects/return";
import { isFunction, exists, always } from "./utils";

type Getter<P, C> = (parent: P) => C;

type Setter<P, C> = (child: C, parent: P) => P;

class Lens<P, C> {
  get: Getter<P, C>;
  set: Setter<P, C>;
  constructor(get: Getter<P, C>, set: Setter<P, C>) {
    this.get = get;
    this.set = set;
  }

  static field = <P, C>(name: string): Lens<P, C> =>
    new Lens(getter(name), setter(name));

  map = <S>(lens: Lens<C, S>): Lens<P, S> => {
    const get: Getter<P, S> = (parent: P) => lens.get(this.get(parent));
    const set: Setter<P, S> = (sub: S, parent: P) =>
      this.set(lens.set(sub, this.get(parent)), parent);
    return new Lens(get, set);
  };
}

type OpticalUpdate<P, C> = {
  lens: Lens<P, C>;
  update: Update<C>;
};

const getter = <P, C>(field: string) => (parent: P): C =>
  parent && parent[field];

const setter = <P, C>(field: string) => (child: C, parent: P): P => ({
  ...parent,
  [field]: child
});

const Optical = <P, C>(
  lens: Lens<P, C>,
  update: Update<C>
): OpticalUpdate<P, C> => ({
  lens,
  update
});

/**
 * Combine optical updates into a single update function
 *
 * @param opticals
 */
const combine = <M>(opticals: OpticalUpdate<M, any>[]) => (
  msg: object,
  model: M
): Updated<M> =>
  opticals.reduce(
    <C>(updated: Return<M>, optical: OpticalUpdate<M, C>) =>
      updated.bind((m: M) => {
        // get child model from parent model
        const child = optical.lens.get(m);
        // call update with child
        const ret: Updated<C> = optical.update(msg, child);
        // if update returned nothing, use previous model
        if (!exists(ret)) {
          return Update(m);
        }
        // ensure each update value is stored as update monad
        const up: Return<C> = Update.wrap(ret);
        // map monad back to parent model and return
        return up.map((c: C) => optical.lens.set(c, m));
      }),
    // wrap model in update monad
    Update(model)
  );

/**
 *
 * Get array of optical updates based on given object structure
 *
 * @param struct
 * @param parentLens
 */
const getOpticals = <M>(
  struct: object,
  parentLens?: Lens<M, any>
): OpticalUpdate<M, any>[] => {
  // Flattened array of optical updates
  const opticals: OpticalUpdate<M, any>[] = [];

  Object.entries(struct).forEach(([field, value]) => {
    // Lens for the currently processed field
    const lens: Lens<M, any> = parentLens
      ? // If parent lens is present, map it with field lens
        parentLens.map(Lens.field(field))
      : // Otherwise use only field lens
        Lens.field(field);
    // If value is a function, assume it is an instance of update
    if (isFunction(value)) {
      // Create optical update with the field lens
      const optical: OpticalUpdate<M, any> = Optical(lens, value);
      // Push to list of optical updates
      opticals.push(optical);
    } else if (typeof value === "object") {
      // Recursively create opticals for each object field
      const childOpticals: OpticalUpdate<M, any>[] = getOpticals(value, lens);
      // Push child optical updates to flattened array
      opticals.push(...childOpticals);
    } else {
      // For any other field, create optical update with constant return value
      const optical: OpticalUpdate<M, any> = Optical(lens, always(value));
      // Push to list of optical updates
      opticals.push(optical);
    }
  });
  return opticals;
};

const compose = <M>(struct: object): Update<M> => combine(getOpticals(struct));

export default compose;