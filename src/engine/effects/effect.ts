import { Dispatch } from "../core/dispatch";

export default class Effect<A> {
  effect: A;

  constructor(effect: A) {
    this.effect = effect;
  }

  execute = (_: Dispatch): void => {};
}
