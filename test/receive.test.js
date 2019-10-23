import Dyne from "~";

import receiver from "~/receive";

const Component = (model, props, children) => (
  <div>
    <div>{props}</div>
    <div>{model}</div>
    <div>{children}</div>
  </div>
);

describe("receive", () => {
  let receive, view;
  beforeEach(() => {
    ({ receive, view } = receiver());
  });

  it("receives single model", () => {
    const Receiver = receive("component", Component);
    const model = {
      component: "receive this"
    };
    const viewer = () => <Receiver />;
    const virtualDom = view(viewer)(model);
    expect(virtualDom).toMatchSnapshot();
  });

  it("receives embedded model", () => {
    const Receiver = receive(
      ["firstChild", "secondChild", "thirdChild"],
      Component
    );
    const model = {
      firstChild: {
        secondChild: {
          thirdChild: "receive this embedded"
        }
      }
    };
    const viewer = () => <Receiver />;
    const virtualDom = view(viewer)(model);
    expect(virtualDom).toMatchSnapshot();
  });

  it("receives multiple components", () => {
    const FirstReceiver = receive("first", Component);
    const SecondReceiver = receive("second", Component);
    const ThirdReceiver = receive("third", Component);

    const model = {
      first: "first",
      second: "second",
      third: "third"
    };

    const viewer = () => (
      <div>
        <FirstReceiver />
        <SecondReceiver />
        <ThirdReceiver />
      </div>
    );

    const virtualDom = view(viewer)(model);
    expect(virtualDom).toMatchSnapshot();
  });

  it("receives props", () => {
    const Receiver = receive("component", Component);
    const model = {
      component: "receive this"
    };
    const viewer = () => <Receiver prop="value" />;
    const virtualDom = view(viewer)(model);
    expect(virtualDom).toMatchSnapshot();
  });

  it("receives children", () => {
    const Receiver = receive("component", Component);
    const model = {
      component: "receive this"
    };
    const viewer = () => <Receiver>child</Receiver>;
    const virtualDom = view(viewer)(model);
    expect(virtualDom).toMatchSnapshot();
  });

  it("receives model, props and children", () => {
    const Receiver = receive("component", Component);
    const model = {
      component: "receive this"
    };
    const viewer = () => <Receiver prop="value">child</Receiver>;
    const virtualDom = view(viewer)(model);
    expect(virtualDom).toMatchSnapshot();
  });
});
