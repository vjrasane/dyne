import Dyne from "../src";

describe("createElement", () => {
  it("creates static element", () => {
    const Component = <div>Hello World!</div>;
    const dom = <Component />;
    expect(dom).toMatchSnapshot();
  });
});
