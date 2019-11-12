import { Context, DynamicElement, VirtualDom, DomElement } from "./types";
import { element, flatten, isFunction, exists } from "./utils";

export default (
  context: Context,
  props: object,
  ...children: VirtualDom[]
): VirtualDom => {
  /**
   * Flatten any inner arrays created from fragments or array literals
   */
  const flatChildren: DomElement[] = flatten(children);
  /**
   * Ensure props are non-null
   */
  const propsObj = props || {};

  /**
   * Dynamic JSX components are passed as functions.
   */
  if (isFunction(context)) {
    return (<DynamicElement>context)(propsObj, flatChildren);
  }

  /**
   *  Raw JSX elements have a string type, props and children.
   */
  if (typeof context === "string") {
    return element(context, propsObj, flatChildren);
  }

  /**
   * Static JSX components are passed as already created elements.
   * Any props or children are ignored.
   */
  if (exists(context) && typeof context === "object") {
    return context;
  }

  throw new Error(
    `Invalid element '${context}', expected string, function or element`
  );
};
