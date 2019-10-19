export default class Effect<A> {
  effect: A;

  constructor(effect: A) {
    this.effect = effect;
  }

  execute(dispatch: (msg: object) => void) {}
}
