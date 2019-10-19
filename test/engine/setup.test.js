import Dyne from "~";
import { setup } from "~/engine/core/setup";

const html = `
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

describe("setup", () => {
  let $root;
  beforeEach(() => {
    document.body.innerHTML = html;
    $root = document.getElementById("root");
  });

  it("render with minimal setup", () => {
    const view = () => <div>Hello World!</div>;
    const procedures = setup({ view })({ node: $root });

    procedures.render();

    expect($root.innerHTML).toMatchSnapshot();
  });
});
