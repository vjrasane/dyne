import { isFunction, flatten, element, isString, exists } from "./utils";

export default {
  createElement: (context, props, ...children) => {
    /**
     * Flatten any inner arrays created from fragments or array literals
     */
    const flatChildren = flatten(children);

    /**
     * Dynamic JSX components are passed as functions.
     */
    if (isFunction(context)) {
      return context(props, flatChildren);
    }

    /**
     *  Raw JSX elements have a string type, props and children.
     */
    if (isString(context)) {
      return element(context, props, flatChildren);
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
  },
  /**
   * Fragments are simply array containers for their children
   */
  Fragment: (_, children) => flatten(children)
};
