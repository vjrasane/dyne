import Effect from "../../../src/engine/effects/effect";

describe("effect", () => {
  let dispatch = jest.fn();

  it("does not dispatch anything0", () => {
    new Effect("effect").execute(dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
