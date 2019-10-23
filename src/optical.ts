import { Update } from "./engine/core/update";
import { Viewer } from "./engine/core/view";
import { identity, Generator } from "./utils";

type Getter<P, C> = (parent: P) => C;

type Setter<P, C> = (child: C, parent: P) => P;

export class Lens<P, C> {
  get: Getter<P, C>;
  set: Setter<P, C>;
  constructor(get: Getter<P, C>, set: Setter<P, C>) {
    this.get = get;
    this.set = set;
  }

  static field = <P, C>(name: string): Lens<P, C> =>
    new Lens(getter(name), setter(name));

  static path = <P>(...path: string[]): Lens<P, any> =>
    path.reduce(
      <C>(lens: Lens<P, C>, field: string): Lens<P, any> =>
        lens.map(Lens.field(field)),
      Lens.identity
    );

  static identity: Lens<any, any> = new Lens(
    identity,
    (obj: any, _): any => obj
  );

  map = <S>(lens: Lens<C, S>): Lens<P, S> => {
    const get: Getter<P, S> = (parent: P) => lens.get(this.get(parent));
    const set: Setter<P, S> = (sub: S, parent: P) =>
      this.set(lens.set(sub, this.get(parent)), parent);
    return new Lens(get, set);
  };
}

export type OpticalUpdate<P, C> = OpticalFunction<P, C, Update<C>>;

export type OpticalView<P, C> = OpticalFunction<P, C, Viewer<C>>;

export type OpticalFunction<P, C, F> = {
  lens: Lens<P, C>;
  func: F;
};

const getter = <P, C>(field: string) => (parent: P): C =>
  parent ? parent[field] : undefined;

const setter = <P, C>(field: string) => (child: C, parent: P): P => ({
  ...parent,
  [field]: child
});

export const Optical = <P, C, F>(
  lens: Lens<P, C>,
  func: F
): OpticalFunction<P, C, F> => ({
  lens,
  func
});

export type Optic<P, C> = Lens<P, C> | string[] | string;

export const toLens = <P, C>(optic: Optic<P, C>): Lens<P, C> => {
  if (typeof optic === "string") {
    return Lens.field(optic);
  } else if (Array.isArray(optic)) {
    return Lens.path(...optic);
  } else {
    return optic;
  }
};
