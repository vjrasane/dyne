import { getInitializer } from "../../../src/engine/core/init";

describe("init", () => {
  const dispatch = jest.fn();

  it("returns undefined for undefined init", () => {
    const init = getInitializer(dispatch);
    expect(init()).toBeUndefined();
  });

  it("returns undefined for null init", () => {
    const init = getInitializer(dispatch, null);
    expect(init()).toBeUndefined();
  });

  it("returns object for object init", () => {
    const obj = {};
    const init = getInitializer(dispatch, obj);
    expect(init()).toBe(obj);
  });

  it("returns function return value", () => {
    const obj = {};
    const func = () => obj;
    const init = getInitializer(dispatch, func);
    expect(init()).toBe(obj);
  });

  it("returns function return value with flags", () => {
    const flag = "flag";
    const func = flags => ({ flags });
    const init = getInitializer(dispatch, func);
    expect(init(flag)).toEqual({ flags: flag });
  });
});
