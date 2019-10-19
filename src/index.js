import DyneElement from "dyne-internals";
import { isFunction, flatten, isString } from "~/utils";

const dyne = () => {
  // inner scope here
  return {
    createElement: (type, props, ...children) => {
      /**
       * Flatten any inner arrays created from fragments or array literals
       */
      const flatChildren = flatten(children);

      /**
       * Dynamic JSX components are passed as functions.
       */
      if (isFunction(type)) {
        return type(props, flatChildren);
      }

      /**
       * Static JSX components are passed as already created elements.
       * Any props or children are ignored.
       */
      if (type instanceof DyneElement) {
        return type;
      }

      /**
       *  Raw JSX elements have a string type, props and children.
       */
      if (isString(type)) {
        return new DyneElement(type, props, flatChildren);
      }

      throw new Error(
        `Invalid element type '${type}', expected string, function or element`
      );
    },
    /**
     * Fragments are simply array containers for their children
     */
    Fragment: (_, children) => flatten(children)
  };
};

export default dyne();
