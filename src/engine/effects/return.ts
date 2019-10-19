import Effect from "./effect";

export default class Return<A> {
  model: A;
  effects: Effect<any>[];

  constructor(model: A, ...effects: Effect<any>[]) {
    this.model = model;
    this.effects = effects || [];
  }

  map<B>(mapper: (model: A) => B): Return<B> {
    return new Return(mapper(this.model), ...this.effects);
  }

  bind<B>(mapper: (model: A) => Return<B>): Return<B> {
    const ret = mapper(this.model);
    return new Return(ret.model, ...this.effects, ...ret.effects);
  }
}
