import { utils } from "dyne-commons";
import { Cmd } from "../../../src/engine/effects/command";

const { identity } = utils;

const timeoutPromise = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("command", () => {
  let dispatch;
  beforeEach(() => {
    dispatch = jest.fn();
  });

  it("processes static result", async () => {
    await Cmd("result").execute(dispatch);
    expect(dispatch).toHaveBeenCalledWith("result");
  });

  it("processes dynamic result", async () => {
    await Cmd(() => "result").execute(dispatch);
    expect(dispatch).toHaveBeenCalledWith("result");
  });

  it("processes static promise", async () => {
    const promise = timeoutPromise(100).then(() => "result");
    await Cmd(promise).execute(dispatch);
    expect(dispatch).toHaveBeenCalledWith("result");
  });

  it("processes dynamic promise", async () => {
    const promise = () => timeoutPromise(100).then(() => "result");
    await Cmd(promise).execute(dispatch);
    expect(dispatch).toHaveBeenCalledWith("result");
  });

  it("processes failure", async () => {
    const err = new Error("Failure");
    const fail = () => {
      throw err;
    };
    await Cmd(fail).execute(dispatch);
    expect(dispatch).toHaveBeenCalledWith(err);
  });

  it("uses custom static result", async () => {
    await Cmd("result", "handler").execute(dispatch);
    expect(dispatch).toHaveBeenCalledWith("handler");
  });

  it("uses custom dynamic result handler", async () => {
    await Cmd("result", res => res.toUpperCase()).execute(dispatch);
    expect(dispatch).toHaveBeenCalledWith("RESULT");
  });

  it("uses custom static failure", async () => {
    const err = new Error("Failure");
    const fail = () => {
      throw err;
    };
    await Cmd(fail, identity, "handler").execute(dispatch);
    expect(dispatch).toHaveBeenCalledWith("handler");
  });

  it("uses custom dynamic failure handler", async () => {
    const err = new Error("Failure");
    const fail = () => {
      throw err;
    };
    await Cmd(fail, identity, err => err.message).execute(dispatch);
    expect(dispatch).toHaveBeenCalledWith("Failure");
  });
});
