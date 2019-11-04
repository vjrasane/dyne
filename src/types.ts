import { VirtualDom, DyneElement } from "dyne-commons";

export type DynamicElement = (
  props: object,
  children: VirtualDom[]
) => VirtualDom;

export type Context = DynamicElement | string | DyneElement;
