import { types as T } from "dyne-commons";

interface IPrototype {
  prototype: any;
}

export default abstract class Component implements IPrototype {
  props: object;
  prototype: any;
  children: T.VirtualDom[];

  constructor(props: object, children: T.VirtualDom[]) {
    this.props = props;
    this.children = children;
  }

  abstract view(): T.VirtualDom | T.VirtualDom[];
}
