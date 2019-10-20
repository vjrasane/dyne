import { getInitializer } from "~/engine/core/init";

describe("init", () => {
  it("returns undefined for undefined init", () => {
    const init = getInitializer();
    expect(init()).toBeUndefined();
  });

  it("returns null for null init", () => {
    const init = getInitializer();
    expect(init()).toBeUndefined();
  });

  it("returns object for object init", () => {
    const obj = {};
    const init = getInitializer(obj);
    expect(init()).toBe(obj);
  });

  it("returns function return value", () => {
    const obj = {};
    const func = () => obj;
    const init = getInitializer(func);
    expect(init()).toBe(obj);
  });

  it("returns function return value with flags", () => {
    const flag = "flag";
    const func = flags => ({ flags });
    const init = getInitializer(func);
    expect(init(flag)).toEqual({ flags: flag });
  });
});
