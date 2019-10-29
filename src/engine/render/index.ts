import {
  exists,
  isFunction,
  Generator,
  isEventProp,
  extractEventName
} from "../../utils";
import { DyneElement, DomElement, VirtualDom } from "../../framework/dom";
import { dispatch, msgEventListener } from "../core/dispatch";
import { Lens } from "../../optical";

const DYNE_INTERNALS_PROP = "@dyne";

const getEventListener = ($target: HTMLElement, event: string): EventListener =>
  <EventListener>Lens.path(DYNE_INTERNALS_PROP, "handlers", event).get($target);

const setEventListener = (
  $target: HTMLElement,
  event: string,
  listener: EventListener
) =>
  ($target[DYNE_INTERNALS_PROP] = Lens.path("handlers", event).set(
    listener,
    $target[DYNE_INTERNALS_PROP]
  ));

const removeBooleanProp = ($target: HTMLElement, name: string): void => {
  $target.removeAttribute(name);
  $target[name] = false;
};

const removeListenerProp = ($target: HTMLElement, name: string) => {
  const event = extractEventName(name);
  const handler: EventListener = getEventListener($target, event);
  $target.removeEventListener(event, handler);
};

const removeProp = ($target: HTMLElement, name: string, value: Prop) => {
  if (isEventProp(name)) {
    removeListenerProp($target, name);
  } else if (name === "className") {
    $target.removeAttribute("class");
  } else if (typeof value === "boolean") {
    removeBooleanProp($target, name);
  } else {
    $target.removeAttribute(name);
  }
};

const setListenerProp = (
  $target: HTMLElement,
  name: string,
  newValue: Generator<object>,
  oldValue?: Prop
) => {
  if (isFunction(oldValue)) {
    removeListenerProp($target, name);
  }
  const handler = msgEventListener(newValue, dispatch);
  const event = extractEventName(name);
  $target.addEventListener(event, handler);
  setEventListener($target, event, handler);
};

const setBooleanProp = (
  $target: HTMLElement,
  name: string,
  value: boolean
): void => {
  $target.setAttribute(name, `${value}`);
  $target[name] = value;
};

const nodeChanged = (firstNode: DomElement, secondNode: VirtualDom) =>
  !(
    firstNode === secondNode ||
    (typeof firstNode === "object" &&
      typeof secondNode === "object" &&
      !Array.isArray(secondNode) &&
      firstNode.type === secondNode.type)
  );

type Prop = Primitive | Function;

type Primitive = string | boolean | number;

const setProp = (
  $target: HTMLElement,
  name: string,
  newValue: Prop,
  oldValue?: Prop
): void => {
  if (isEventProp(name)) {
    setListenerProp($target, name, <Generator<object>>newValue, oldValue);
  } else if (name === "className" && typeof newValue === "string") {
    $target.setAttribute("class", newValue);
  } else if (typeof newValue === "boolean") {
    setBooleanProp($target, name, newValue);
  } else {
    $target.setAttribute(name, `${<Primitive>newValue}`);
  }
};

const setProps = ($target: HTMLElement, props: object = {}): void => {
  Object.entries(props).forEach(([name, value]) => {
    setProp($target, name, value);
  });
};

const updateProp = (
  $target: HTMLElement,
  name: string,
  newValue: Prop,
  oldValue: Prop
) => {
  if (!newValue) {
    removeProp($target, name, oldValue);
  } else if (!oldValue || newValue !== oldValue) {
    setProp($target, name, newValue, oldValue);
  }
};

const updateProps = (
  $target: HTMLElement,
  newProps: object,
  oldProps: object = {}
) => {
  const props: object = Object.assign({}, oldProps, newProps);
  Object.keys(props).forEach(name => {
    updateProp($target, name, newProps[name], oldProps[name]);
  });
};

const createElement = (node: DomElement): HTMLElement | Text => {
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

const isPrimitive = (elem: VirtualDom): boolean =>
  typeof elem === "string" ||
  typeof elem === "boolean" ||
  typeof elem === "number";

const asArray = (arr: VirtualDom): DomElement[] =>
  Array.isArray(arr) ? arr : [];

const updateElement = (
  $parent: HTMLElement,
  newNode: DomElement,
  oldNode?: VirtualDom,
  index?: number
): void => {
  /**
   * If old node does not exists, simply create a new element
   */
  if (!exists(oldNode)) {
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
    const oldElem: DyneElement = <DyneElement>oldNode;
    /**
     * Update element props
     */
    updateProps(
      <HTMLElement>$parent.childNodes[index],
      newNode.props,
      oldElem.props
    );

    /**
     * Update element children
     */
    const newLength: number = newNode.children.length;
    const oldLength: number = oldElem.children.length;
    for (let i = 0; i < Math.max(newLength, oldLength); i++) {
      return updateDom(
        <HTMLElement>$parent.childNodes[index],
        newNode.children[i],
        oldElem.children[i],
        i
      );
    }
    /**
     * If nothing else was done and element is not a primitive, throw an error
     */
  } else if (!isPrimitive(newNode)) {
    throw new Error(`Invalid virtual DOM element '${newNode}'`);
  }
};

const updateDom = (
  $parent: HTMLElement,
  newDom: VirtualDom,
  oldDom?: VirtualDom,
  index: number = 0
): void => {
  if (Array.isArray(newDom)) {
    /**
     * If new node is an array, call updateElement recursively for
     * each of its elements and the possible counterpart in the old
     * virtual DOM.
     */
    const oldArray: DomElement[] = asArray(oldDom);

    const newLength: number = newDom.length;
    const oldLength: number = oldArray.length;

    for (let i = 0; i < Math.max(newLength, oldLength); i++) {
      updateDom($parent, newDom[i], oldArray[i], i);
    }
  } else {
    /**
     * Otherwise update single element
     */
    updateElement($parent, <DomElement>newDom, oldDom, index);
  }
};

export const renderer = (
  $root: HTMLElement,
  newDom: VirtualDom,
  oldDom?: VirtualDom
): void => {
  if (exists($root)) {
    return updateDom($root, newDom, oldDom);
  } else {
    throw new Error(`Invalid root node '${$root}'`);
  }
};
