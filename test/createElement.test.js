import Dyne from "~";

describe("createElement", () => {
  it("creates basic element", () => {
    const dom = <div>Hello World!</div>;
    expect(dom).toMatchSnapshot();
  });

  it("creates dynamic element", () => {
    const Component = (props, children) => <div {...props}>{children}</div>;
    const dom = <Component prop="value">child</Component>;
    expect(dom).toMatchSnapshot();
  });

  it("creates static element", () => {
    const Component = <div>Hello World!</div>;
    const dom = <Component />;
    expect(dom).toMatchSnapshot();
  });

  it("creates element basic children", () => {
    const dom = (
      <div>
        <div>child</div>
      </div>
    );
    expect(dom).toMatchSnapshot();
  });

  it("throws error with invalid element", () => {
    expect(() => Dyne.createElement(1000)).toThrowError();
  });
});
