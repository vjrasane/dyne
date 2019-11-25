import Dyne from "../../../src";
import { setup } from "../../../src/engine/core/setup";
import { getDispatcher } from "../../../src/engine/core/dispatch";
import { Cmd } from "../../../src/engine/effects/command";
const html = `
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;
jest.useFakeTimers();

describe("setup", () => {
  let $root, dispatch, queues, setupBase;
  const clickHandler = event => ({ action: "event", event });
  const view = () => (
    <div id="clickable" onClick={clickHandler}>
      Hello World!
    </div>
  );
  beforeEach(() => {
    ({ dispatch, queues } = getDispatcher());
    setupBase = setupObj => setup(dispatch, queues, setupObj);
    document.body.innerHTML = html;
    $root = document.getElementById("root");
  });

  it("render with minimal setup", () => {
    const procedures = setupBase({ view })({ node: $root });

    procedures.view(); // initial dom
    procedures.render();

    expect($root.innerHTML).toMatchSnapshot();
  });

  it("does not render when dom has not changed", () => {
    const procedures = setupBase({ view })({ node: $root });

    procedures.view(); // initial dom
    procedures.render();
    procedures.render();

    expect($root.innerHTML).toMatchSnapshot();
  });

  it("does not create new dom when model has not changed", () => {
    const mockView = jest.fn().mockImplementation(view);
    const procedures = setupBase({ view: mockView })({ node: $root });
    procedures.view(); // initial dom
    mockView.mockClear();
    procedures.view();
    expect(mockView).not.toHaveBeenCalled();
  });

  it("does not update when no events are queued", () => {
    const update = jest.fn();
    const procedures = setupBase({ view, update })({ node: $root });
    procedures.update();
    expect(update).not.toHaveBeenCalled();
  });

  it("updates when events are queued", () => {
    const update = jest.fn();
    const procedures = setupBase({ view, update })({ node: $root });
    dispatch("message");
    procedures.update();
    expect(update).toHaveBeenCalledWith("message", undefined);
  });

  it("updates after click event", () => {
    const update = jest.fn();
    const procedures = setupBase({ view, update })({ node: $root });

    procedures.view(); // initial dom
    procedures.render();

    document
      .getElementById("clickable")
      .dispatchEvent(new window.Event("click"));

    procedures.update();

    expect(update.mock.calls).toMatchSnapshot();
  });

  it("creates new dom when model has changed", () => {
    const mockView = jest.fn().mockImplementation(view);
    const update = (msg, model) => ({ msg, model });
    const procedures = setupBase({ view: mockView, update })({ node: $root });
    dispatch("message");

    procedures.view(); // initial dom
    procedures.update();
    procedures.view();

    expect(mockView.mock.calls).toMatchSnapshot();
  });

  it("does not process effects if none are queued", () => {
    const mockDispatch = jest.fn();
    const procedures = setup(mockDispatch, queues, { view })({ node: $root });
    procedures.effect();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("processes queued effect", async () => {
    dispatch(Cmd("effect"));
    const mockDispatch = jest.fn();
    const procedures = setup(mockDispatch, queues, { view })({ node: $root });
    await procedures.effect();
    expect(mockDispatch).toHaveBeenCalledWith("effect");
  });
});
