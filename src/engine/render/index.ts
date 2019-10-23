import { isFunction, exists } from "../../utils";
import { DyneElement, DomElement, VirtualDom } from "../../framework/dom";
import { msgEventListener } from "../effects/command";
import { dispatch } from "../core/dispatch";

const isEventProp = (name: string): boolean => /^on/.test(name);

const extractEventName = (name: string): string => name.slice(2).toLowerCase();

const removeBooleanProp = ($target: HTMLElement, name: string): void => {
  $target.removeAttribute(name);
  $target[name] = false;
};

const removeProp = (
  $target: HTMLElement,
  name: string,
  value: string | boolean
) => {
  if (name === "className") {
    $target.removeAttribute("class");
  } else if (typeof value === "boolean") {
    removeBooleanProp($target, name);
  } else {
    $target.removeAttribute(name);
  }
};

const setBooleanProp = ($target: HTMLElement, name: string, value) => {
  if (value) {
    $target.setAttribute(name, value);
    $target[name] = true;
  } else {
    $target[name] = false;
  }
};

const propChanged = (firstProp: Prop, secondProp: Prop) =>
  !(
    firstProp === secondProp ||
    (isFunction(firstProp) &&
      isFunction(secondProp) &&
      firstProp.toString() === secondProp.toString())
  );

const nodeChanged = (firstNode: DomElement, secondNode: VirtualDom) =>
  !(
    firstNode === secondNode ||
    (typeof firstNode === "object" &&
      typeof secondNode === "object" &&
      !Array.isArray(secondNode) &&
      firstNode.type === secondNode.type)
  );

type Prop = string | boolean | Function;

const setProp = ($target: HTMLElement, name: string, value): void => {
  if (isEventProp(name)) {
    $target.addEventListener(
      extractEventName(name),
      msgEventListener(value, dispatch)
    );
  } else if (name === "className") {
    $target.setAttribute("class", value);
  } else if (typeof value === "boolean") {
    setBooleanProp($target, name, value);
  } else {
    $target.setAttribute(name, value);
  }
};

const setProps = ($target: HTMLElement, props: object): void => {
  Object.keys(props).forEach(name => {
    setProp($target, name, props[name]);
  });
};

const updateProp = (
  $target: HTMLElement,
  name: string,
  newValue: string,
  oldValue: string
) => {
  if (!newValue) {
    removeProp($target, name, oldValue);
  } else if (!oldValue || propChanged(newValue, oldValue)) {
    setProp($target, name, newValue);
  }
};

const updateProps = (
  $target: HTMLElement,
  newProps: object,
  oldProps: object = {}
) => {
  const props = Object.assign({}, newProps, oldProps);
  Object.keys(props).forEach(name => {
    updateProp($target, name, newProps[name], oldProps[name]);
  });
};

const createElement = (node: DomElement) => {
  if (typeof node === "object") {
    const $el = document.createElement(node.type);
    setProps($el, node.props);
    node.children.map(createElement).forEach($el.appendChild.bind($el));
    return $el;
  } else if (typeof node === "string" || typeof node === "number") {
    return document.createTextNode(`${node}`);
  } else {
    throw new Error(`Invalid DOM element: '${node}'`);
  }
};

const asElement = (elem: VirtualDom): DyneElement =>
  typeof elem === "object" && !Array.isArray(elem)
    ? elem
    : { props: [], children: [] };

const asArray = (arr: VirtualDom): DomElement[] =>
  Array.isArray(arr) ? arr : [];

const updateElement = (
  $parent: HTMLElement,
  newNode: VirtualDom,
  oldNode?: VirtualDom,
  index = 0
) => {
  /**
   * If new node is an array, call updateElement recursively for
   * each of its elements and the possible counterpart in the old
   * virtual DOM.
   */
  if (Array.isArray(newNode)) {
    const oldElem = asArray(oldNode);

    const newLength = newNode.length;
    const oldLength = oldElem.length;

    for (let i = 0; i < Math.max(newLength, oldLength); i++) {
      updateElement($parent, newNode[i], oldElem[i], i);
    }
    /**
     * If old node does not exists, simply create a new element
     */
  } else if (!exists(oldNode)) {
    $parent.appendChild(createElement(newNode));
    /**
     * If new node does not exist, remove the element from the DOM.
     */
  } else if (!exists(newNode)) {
    $parent.removeChild($parent.childNodes[index]);
    /**
     * Both exists, so check if the element has changed and replace it
     */
  } else if (nodeChanged(newNode, oldNode)) {
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
    /**
     * Both exists and have not been changed, so update element props
     * and children
     */
  } else if (typeof newNode === "object") {
    const oldElem = asElement(oldNode);
    /**
     * Update element props
     */
    updateProps(
      <HTMLElement>$parent.childNodes[index],
      newNode.props,
      oldElem.props
    );
    const newLength = newNode.children.length;
    const oldLength = oldElem.children.length;
    /**
     * Update element children
     */
    for (let i = 0; i < Math.max(newLength, oldLength); i++) {
      updateElement(
        <HTMLElement>$parent.childNodes[index],
        newNode.children[i],
        oldElem.children[i],
        i
      );
    }
  } else {
    throw new Error(`Invalid virtual DOM element '${newNode}'`);
  }
};

export const renderer = (
  $root: HTMLElement,
  newDom: VirtualDom,
  oldDom?: VirtualDom
): void => {
  if (exists($root)) {
    updateElement($root, newDom, oldDom);
  } else {
    throw new Error(`Invalid root node '${$root}'`);
  }
};
