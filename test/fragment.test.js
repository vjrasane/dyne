import Dyne from "~";

describe("fragment", () => {
  it("creates empty fragment", () => {
    const dom = <></>;
    expect(dom).toMatchSnapshot();
  });

  it("creates basic fragment", () => {
    const dom = (
      <>
        Hello World!
        <div>child</div>
      </>
    );
    expect(dom).toMatchSnapshot();
  });

  it("creates dynamic fragment", () => {
    const Component = (props, children) => (
      <>
        <div {...props}></div>
        <div>{children}</div>
      </>
    );
    const dom = <Component prop="value">child</Component>;
    expect(dom).toMatchSnapshot();
  });
});
