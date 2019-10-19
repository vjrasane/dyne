export default class DyneElement {
  constructor(type, props, children) {
    this.type = type;
    this.props = props || [];
    this.children = children;
  }
}

// DyneElement.empty = new DyneElement();
