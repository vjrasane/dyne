import { utils } from "dyne-commons";
import { DomElement, DyneElement } from "./types";

export const { isFunction, flatten, exists } = utils;

export const element = (
  context: string,
  props: object,
  children: DomElement[]
): DyneElement => ({
  type: context,
  props: props || {},
  children: children || []
});
