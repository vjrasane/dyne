import { DyneElement, DomElement } from "dyne-commons";

export const element = (
  context: string,
  props: object,
  children: DomElement[]
): DyneElement => ({
  type: context,
  props: props || {},
  children: children || []
});
