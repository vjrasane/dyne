import Dyne from "~";
import { getViewer } from "~/engine/core/view";

describe("view", () => {
  it("returns basic virtual dom", () => {
    const viewer = getViewer(<div>Basic static element</div>);
    const virtualDom = viewer();
    expect(virtualDom).toMatchSnapshot();
  });

  it("returns basic virtual dom from function", () => {
    const viewer = getViewer(() => <div>Basic dynamic element</div>);
    const virtualDom = viewer();
    expect(virtualDom).toMatchSnapshot();
  });

  it("returns string", () => {
    const viewer = getViewer("string");
    const virtualDom = viewer();
    expect(virtualDom).toMatchSnapshot();
  });

  it("returns number", () => {
    const viewer = getViewer(1000);
    const virtualDom = viewer();
    expect(virtualDom).toMatchSnapshot();
  });

  it("returns array with fragment", () => {
    const viewer = getViewer(() => (
      <>
        Hello World!
        <div>Second Element</div>
        <span>Third Element</span>
      </>
    ));
    const virtualDom = viewer();
    expect(virtualDom).toMatchSnapshot();
  });

  it("returns array with array literal", () => {
    const viewer = getViewer(() => [
      "Hello World!",
      <div>Second Element</div>,
      <span>Third Element</span>
    ]);
    const virtualDom = viewer();
    expect(virtualDom).toMatchSnapshot();
  });

  it("returns component contents", () => {
    const Component = <div>Component</div>;
    const viewer = getViewer(<Component />);
    const virtualDom = viewer();
    expect(virtualDom).toMatchSnapshot();
  });

  it("returns component function contents", () => {
    const Component = () => <div>Component contents</div>;
    const viewer = getViewer(<Component />);
    const virtualDom = viewer();
    expect(virtualDom).toMatchSnapshot();
  });

  it("returns component function contents with props", () => {
    const Component = props => <div {...props}>Component contents</div>;
    const viewer = getViewer(<Component prop="value" />);
    const virtualDom = viewer();
    expect(virtualDom).toMatchSnapshot();
  });

  it("returns component function contents with children", () => {
    const Component = (props, children) => <div>{children}</div>;
    const viewer = getViewer(
      <Component>
        <div>Component child</div>
      </Component>
    );
    const virtualDom = viewer();
    expect(virtualDom).toMatchSnapshot();
  });

  it("returns component function contents with props and children", () => {
    const Component = (props, children) => <div {...props}>{children}</div>;
    const viewer = getViewer(
      <Component prop="value">
        <div>Component child</div>
      </Component>
    );
    const virtualDom = viewer();
    expect(virtualDom).toMatchSnapshot();
  });

  it("throws error with undefined view", () => {
    expect(getViewer).toThrowError();
  });

  it("throws error with invalid element", () => {
    expect(() => Dyne.createElement(null)).toThrowError();
  });
});
