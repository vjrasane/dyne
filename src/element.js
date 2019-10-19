export class DyneElement {
  constructor(type, props, children) {
    this.type = type;
    this.props = props || [];
    this.children = children;
  }
}

DyneElement.empty = new DyneElement();

export const isElement = obj => obj instanceof DyneElement;
