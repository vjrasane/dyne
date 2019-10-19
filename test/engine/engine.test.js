import Dyne from "~";
import { engine } from "~/engine";

const html = `
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

describe("engine", () => {
  let $root;
  beforeEach(() => {
    document.body.innerHTML = html;
    $root = document.getElementById("root");
  });

  it("engine with minimal setup", () => {
    const view = () => <div>Hello World!</div>;
    engine({ view })({ node: $root });
  });
});
