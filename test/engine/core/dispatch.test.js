import { getDispatcher } from "../../../src/engine/core/dispatch";
import { Cmd } from "../../../src/engine/effects/command";
import { Sub } from "../../../src/engine/effects/subscription";

describe("dispatch", () => {
  let dispatch, queues;
  beforeEach(() => {
    ({ dispatch, queues } = getDispatcher());
  });

  it("queues message", () => {
    dispatch("message");
    expect(queues).toMatchSnapshot();
  });

  it("queues integers", () => {
    dispatch(0);
    dispatch(1000);
    expect(queues).toMatchSnapshot();
  });

  it("queues booleans", () => {
    dispatch(false);
    dispatch(true);
    expect(queues).toMatchSnapshot();
  });

  it("queues objects", () => {
    dispatch({});
    dispatch({ action: "action" });
    expect(queues).toMatchSnapshot();
  });

  it("queues function", () => {
    dispatch(() => {});
    expect(queues).toMatchSnapshot();
  });

  it("queues command", () => {
    dispatch(Cmd("command"));
    expect(queues).toMatchSnapshot();
  });

  it("queues subscription", () => {
    dispatch(Sub.interval("effect", 100));
    expect(queues).toMatchSnapshot();
  });

  it("does not queue undefined", () => {
    dispatch();
    expect(queues).toMatchSnapshot();
  });

  it("does not queue null", () => {
    dispatch(null);
    expect(queues).toMatchSnapshot();
  });
});
