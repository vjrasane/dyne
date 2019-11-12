import { types } from "dyne-commons";

export type DomElement = types.DomElement;
export type DyneElement = types.DyneElement;
export type VirtualDom = types.VirtualDom;

export type DynamicElement = (
  props: object,
  children: VirtualDom[]
) => VirtualDom;

export type Context = DynamicElement | string | DyneElement;
