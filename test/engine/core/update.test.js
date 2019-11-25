import { getUpdater, Update } from "../../../src/engine/core/update";
import { Cmd } from "../../../src/engine/effects/command";
import { Sub } from "../../../src/engine/effects/subscription";

describe("update", () => {
  it("does not wrap an update", () => {
    const update = Update("model");
    expect(Update.wrap(update)).toBe(update);
  });

  it("wraps a command", () => {
    expect(Update.wrap(Cmd("effect"))).toMatchSnapshot();
  });

  it("wraps a subscription", () => {
    expect(Update.wrap(Sub.interval("effect", 100))).toMatchSnapshot();
  });

  it("wraps a model", () => {
    expect(Update.wrap("model")).toMatchSnapshot();
  });

  it("handles basic update", () => {
    const update = getUpdater(jest.fn(), (msg, model) => ({
      msg,
      model
    }));
    expect(update("msg", "model")).toMatchSnapshot();
  });

  it("dispatches command", () => {
    const dispatch = jest.fn();
    const cmd = Cmd("effect");
    const update = getUpdater(dispatch, () => cmd);
    expect(update("msg", "model")).toBe("model");
    expect(dispatch).toHaveBeenCalledWith(cmd);
  });

  it("dispatches subscription", () => {
    const dispatch = jest.fn();
    const sub = Sub.interval("effect", 100);
    const update = getUpdater(dispatch, () => sub);
    expect(update("msg", "model")).toBe("model");
    expect(dispatch).toHaveBeenCalledWith(sub);
  });

  it("dispatches function", () => {
    const dispatch = jest.fn();
    const func = () => {};
    const update = getUpdater(dispatch, () => func);
    expect(update("msg", "model")).toBe("model");
    expect(dispatch.mock.calls[0][0].effect).toBe(func);
  });

  it("dispatches promise", () => {
    const dispatch = jest.fn();
    const promise = Promise.resolve("result");
    const update = getUpdater(dispatch, () => promise);
    expect(update("msg", "model")).toBe("model");
    expect(dispatch.mock.calls[0][0].effect).toBe(promise);
  });

  it("handles update with effects", () => {
    const dispatch = jest.fn();
    const cmd = Cmd("effect");
    const sub = Sub.interval("effect", 100);
    const func = () => {};
    const promise = Promise.resolve("result");
    const obj = {};
    const update = getUpdater(dispatch, (msg, model) =>
      Update({ msg, model }, cmd, sub, func, promise, obj)
    );
    expect(update("msg", "model")).toMatchSnapshot();

    const { calls } = dispatch.mock;
    expect(calls[0][0]).toBe(cmd);
    expect(calls[1][0]).toBe(sub);
    expect(calls[2][0].effect).toBe(func);
    expect(calls[3][0].effect).toBe(promise);
    expect(calls[4][0].effect).toBe(obj);
  });

  it("throws error with invalid update", () => {
    expect(getUpdater(jest.fn(), "yolo")).toThrowError();
  });
});
