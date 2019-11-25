import Dyne from "../../src";

describe("fragment", () => {
  it("creates empty fragment", () => {
    const dom = Dyne.Fragment();
    expect(dom).toMatchSnapshot();
  });

  it("creates basic fragment", () => {
    const dom = Dyne.Fragment(null, ["Hello World!", <div>child</div>]);
    expect(dom).toMatchSnapshot();
  });

  it("creates dynamic fragment", () => {
    const Component = (props, children) =>
      Dyne.Fragment(null, [<div {...props}></div>, <div>{children}</div>]);
    const dom = <Component prop="value">child</Component>;
    expect(dom).toMatchSnapshot();
  });
});
