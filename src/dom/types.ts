import { types } from "dyne-commons";

export type DynamicElement = (
  props: object,
  children: types.VirtualDom[]
) => types.VirtualDom;

export type Context =
  | DynamicElement
  | string
  | boolean
  | number
  | types.DyneElement;
