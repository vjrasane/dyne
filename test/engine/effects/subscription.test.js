import { utils } from "dyne-commons";
import { Sub } from "../../../src/engine/effects/subscription";
import { Cmd } from "../../../src/engine/effects/command";

const { identity } = utils;

jest.useFakeTimers();

describe("subscription", () => {
  let dispatch;
  beforeEach(() => {
    dispatch = jest.fn();
  });

  it("sets interval with simple effect", () => {
    Sub.interval("effect", 100).execute(dispatch);

    jest.advanceTimersByTime(1000);
    expect(dispatch).toHaveBeenCalledWith("effect");
    expect(dispatch).toHaveBeenCalledTimes(10);
  });

  it("sets interval with command effect", () => {
    const cmd = Cmd(() => "effect");
    Sub.interval(cmd, 100).execute(dispatch);

    jest.advanceTimersByTime(1000);
    expect(dispatch).toHaveBeenCalledWith(cmd);
    expect(dispatch).toHaveBeenCalledTimes(10);
  });

  it("cancels interval", async () => {
    const sub = Sub.interval("effect", 100);
    sub.execute(dispatch);
    await sub.cancel().execute(dispatch);
    dispatch.mockClear();

    jest.advanceTimersByTime(1000);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("listens to window events", () => {
    Sub.listen("click", event => ({ msg: "click", event })).execute(dispatch);
    window.dispatchEvent(new window.Event("click"));
    expect(dispatch.mock.calls).toMatchSnapshot();
  });

  it("stops listening to window events", async () => {
    const sub = Sub.listen("click", event => ({ msg: "click", event }));
    await sub.cancel().execute(dispatch);
    dispatch.mockClear();

    window.dispatchEvent(new window.Event("click"));
    expect(dispatch).not.toHaveBeenCalled();
  });
});
