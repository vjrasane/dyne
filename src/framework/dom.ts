export type Context = Function | string | object;

export type DyneElement = {
  type?: string;
  props: object;
  children: DomElement[];
};

export type DomElement = string | number | boolean | DyneElement;

export type VirtualDom = DomElement | DomElement[];

export type DynamicElement = (props: object, children: object[]) => VirtualDom;
