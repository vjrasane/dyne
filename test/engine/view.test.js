import Dyne from "~";
import { getViewer } from "~/engine/core/view";

describe("view", () => {
  it("returns basic virtual dom", () => {
    const viewer = getViewer(() => <div>Hello World!</div>);
    const virtualDom = viewer();
    expect(virtualDom).toMatchSnapshot();
  });

  it("throws error with undefined view", () => {
    expect(getViewer).toThrowError();
  });
});
