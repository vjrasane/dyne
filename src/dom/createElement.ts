import { utils as U, types as T } from "dyne-commons";
import { Context, DynamicElement } from "./types";
import Component from "./component";
import { element } from "./utils";

export default (
  context: Context,
  props?: object,
  ...children: T.VirtualDom[]
): T.VirtualDom => {
  /**
   * Flatten any inner arrays created from fragments or array literals
   */
  const flatChildren: T.DomElement[] = U.flatten(children);
  /**
   * Ensure props are non-null
   */
  const propsObj = props || {};

  /**
   * Dynamic JSX components are passed as functions.
   */
  if (U.isFunction(context)) {
    /**
     * If context function extends Component, call its constructor
     */
    if ((<Function>context).prototype instanceof Component)
      return new (<any>context)(propsObj, flatChildren);
    /**
     * Otherwise call the standard function
     */
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
  if (U.exists(context) && typeof context === "object") {
    return context;
  }

  throw new Error(
    `Invalid element '${context}', expected string, function or element`
  );
};
