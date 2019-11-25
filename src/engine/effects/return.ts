import Effect from "./effect";
import { Cmd } from "./command";
import { CmdFx } from "./types";

export type Effectable<A> = Effect<A> | CmdFx<A>;

export default class Return<A> {
  model: A;
  effects: Effectable<any>[];

  constructor(model: A, ...effects: Effectable<any>[]) {
    this.model = model;
    this.effects = effects.map(Cmd.wrap);
  }

  map = <B>(mapper: (model: A) => B): Return<B> =>
    new Return(mapper(this.model), ...this.effects);

  bind = <B>(mapper: (model: A) => Return<B>): Return<B> => {
    const ret = mapper(this.model);
    return new Return(ret.model, ...this.effects, ...ret.effects);
  };
}
