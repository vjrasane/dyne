import { types } from "dyne-commons";

export const element = (
  context: string,
  props?: object,
  children?: types.DomElement[]
): types.DyneElement => ({
  type: context,
  props: props || {},
  children: children || []
});
