import Dyne from "../src";

class Component extends Dyne.Component {
  constructor(props, children) {
    super(props, children);
  }

  view = () => (
    <div id="component" {...this.props}>
      Component
      {this.children}
    </div>
  );
}

describe("component", () => {
  it("creates basic component", () => {
    const dom = <Component />;
    expect(dom).toMatchSnapshot();
  });

  it("creates component with props", () => {
    const dom = (
      <Component data-prop="value" data-bool={true} className="class" />
    );
    expect(dom).toMatchSnapshot();
  });

  it("creates component with children", () => {
    const dom = (
      <Component>
        <div>FIRST</div>
        <div>SECOND</div>
        <div>THIRD</div>
      </Component>
    );
    expect(dom).toMatchSnapshot();
  });
});
