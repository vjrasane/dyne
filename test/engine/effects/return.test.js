import Return from "../../../src/engine/effects/return";
import { Cmd } from "../../../src/engine/effects/command";

describe("return", () => {
  it("creates basic return", () => {
    expect(new Return("model")).toMatchSnapshot();
  });

  it("creates return with effects", () => {
    expect(
      new Return("model", Cmd("command"), Cmd("effect"))
    ).toMatchSnapshot();
  });

  it("maps return model", () => {
    const ret = new Return("model", Cmd("command"));
    expect(ret.map(m => m.toUpperCase())).toMatchSnapshot();
  });

  it("binds return model and effects", () => {
    const ret = new Return("model", Cmd("command"));
    const bound = ret.bind(m => new Return(m.toUpperCase(), Cmd("effect")));
    expect(bound).toMatchSnapshot();
  });
});
