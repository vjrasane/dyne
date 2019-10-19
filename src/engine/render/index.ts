import { isFunction, exists } from "../utils";
import { msgEventListener } from "../effects/command";
import { isElement, DyneElement } from "../../element";
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
    (firstNode instanceof DyneElement &&
      secondNode instanceof DyneElement &&
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

const createElement = (node: DyneElement | string) => {
  if (node instanceof DyneElement) {
    const $el = document.createElement(node.type);
    setProps($el, node.props);
    node.children.map(createElement).forEach($el.appendChild.bind($el));
    return $el;
  }
  return document.createTextNode(node);
};

type DomElement = string | DyneElement;

export type VirtualDom = DomElement | DomElement[];

const updateElement = (
  $parent: HTMLElement,
  newNode: DomElement,
  oldNode: VirtualDom,
  index = 0
) => {
  if (!exists(oldNode)) {
    $parent.appendChild(createElement(newNode));
  } else if (!exists(newNode)) {
    $parent.removeChild($parent.childNodes[index]);
  } else if (nodeChanged(newNode, oldNode)) {
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
  } else if (newNode instanceof DyneElement) {
    const oldElem =
      oldNode instanceof DyneElement ? oldNode : DyneElement.empty;
    updateProps(
      <HTMLElement>$parent.childNodes[index],
      newNode.props,
      oldElem.props
    );
    const newLength = newNode.children.length;
    const oldLength = oldElem.children.length;
    for (let i = 0; i < Math.max(newLength, oldLength); i++) {
      updateElement(
        <HTMLElement>$parent.childNodes[index],
        newNode.children[i],
        oldElem.children[i],
        i
      );
    }
  }
};

export const renderer = (
  $root: HTMLElement,
  newDom: VirtualDom,
  oldDom: VirtualDom
): void => {
  if (Array.isArray(newDom)) {
    newDom.forEach((node: DyneElement, index: number) =>
      updateElement($root, node, oldDom ? oldDom[index] : null, index)
    );
  } else {
    updateElement($root, newDom, oldDom);
  }
};
