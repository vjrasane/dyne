import Dyne from "../../../src";
import getRenderer from "../../../src/engine/render";
import { utils } from "dyne-commons";
import pretty from "pretty";

const { putAt, removeAt } = utils;

const html = `
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

describe("render", () => {
  let $root;
  const dispatch = jest.fn();
  const renderer = getRenderer(dispatch);
  const initDocument = () => {
    document.body.innerHTML = html;
    $root = document.getElementById("root");
  };

  beforeEach(() => {
    initDocument();
    dispatch.mockClear();
  });

  describe("basic", () => {
    it("throws error with missing root", () => {
      expect(renderer).toThrowError();
    });

    it("throws error with invalid virtual DOM", () => {
      const dom = () => {};
      expect(() => renderer($root, dom, dom)).toThrowError();
    });

    it("throws error with invalid DOM element", () => {
      expect(() => renderer($root, () => {})).toThrowError();
    });

    it("renders basic dom", () => {
      const virtualDom = <div>Hello World!</div>;
      renderer($root, virtualDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });

    it("renders string", () => {
      const virtualDom = "string";
      renderer($root, virtualDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });

    it("renders number", () => {
      const virtualDom = 1000;
      renderer($root, virtualDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });

    it("renders element replaced string", () => {
      const virtualDom = "string";
      renderer($root, virtualDom);
      const elementDom = <div>replace</div>;
      renderer($root, elementDom, virtualDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });
  });

  describe("props", () => {
    const listener = jest.fn();

    const props = {
      className: "class",
      prop: "value",
      bool: true,
      onClick: listener
    };

    const propsDom = <div {...props}>elem</div>;

    const simulateClick = elem => {
      const event = document.createEvent("HTMLEvents");
      event.initEvent("click", false, true);
      elem.dispatchEvent(event);
    };

    beforeEach(() => {
      renderer($root, propsDom);
      listener.mockClear();
    });

    it("renders props", () => {
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });

    it("renders added prop", () => {
      const updatedDom = (
        <div added="new" {...props}>
          elem
        </div>
      );
      renderer($root, updatedDom, propsDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });

    it("removes prop", () => {
      const removed = { ...props };
      delete removed["prop"];
      const updatedDom = <div {...removed}>elem</div>;
      renderer($root, updatedDom, propsDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });

    it("removes class prop", () => {
      const removed = { ...props };
      delete removed["className"];
      const updatedDom = <div {...removed}>elem</div>;
      renderer($root, updatedDom, propsDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });

    it("renders updated prop", () => {
      const updatedDom = (
        <div {...props} prop="updated">
          elem
        </div>
      );
      renderer($root, updatedDom, propsDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });

    it("removes false boolean prop", () => {
      const updatedDom = (
        <div {...props} bool={false}>
          elem
        </div>
      );
      renderer($root, updatedDom, propsDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });

    it("renders entire new props", () => {
      initDocument();
      const dom = {
        type: "div",
        children: []
      };
      renderer($root, dom);
      const updatedDom = <div {...props}>elem</div>;
      renderer($root, updatedDom, dom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });

    it("calls event handler on click", () => {
      simulateClick($root.childNodes[0]);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("replaces event handler", () => {
      const newHandler = jest.fn();
      const updatedDom = (
        <div {...props} onClick={newHandler}>
          elem
        </div>
      );
      renderer($root, updatedDom, propsDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();

      simulateClick($root.childNodes[0]);

      expect(listener).not.toHaveBeenCalled();
      expect(newHandler).toHaveBeenCalledTimes(1);
    });

    it("removes event handler", () => {
      const removed = { ...props };
      delete removed["onClick"];
      const updatedDom = <div {...removed}>elem</div>;
      renderer($root, updatedDom, propsDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();

      simulateClick($root.childNodes[0]);
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("array", () => {
    const arrayDom = [<div>first</div>, <div>second</div>, <div>third</div>];

    beforeEach(() => {
      renderer($root, arrayDom);
    });

    it("renders all elements in array", () => {
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });

    it("adds element to front correctly", () => {
      const appendedDom = putAt(arrayDom, <div>added</div>, 0);
      renderer($root, appendedDom, arrayDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });

    it("adds element to middle correctly", () => {
      const appendedDom = putAt(arrayDom, <div>added</div>, 1);
      renderer($root, appendedDom, arrayDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });

    it("adds element to end correctly", () => {
      const appendedDom = putAt(arrayDom, <div>added</div>, 3);
      renderer($root, appendedDom, arrayDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });

    it("removes element from front correctly", () => {
      const removedDom = removeAt(arrayDom, 0);
      renderer($root, removedDom, arrayDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });

    it("removes element from middle correctly", () => {
      const removedDom = removeAt(arrayDom, 1);
      renderer($root, removedDom, arrayDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });

    it("removes element from end correctly", () => {
      const removedDom = removeAt(arrayDom, 2);
      renderer($root, removedDom, arrayDom);
      expect(pretty($root.innerHTML)).toMatchSnapshot();
    });
  });
});
