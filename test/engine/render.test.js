import { renderer } from "~/engine/render";
import { element } from "../../src/utils";

const html = `
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

describe("render", () => {
  let $root;
  beforeEach(() => {
    document.body.innerHTML = html;
    $root = document.getElementById("root");
  });

  it("renders basic dom", () => {
    const virtualDom = element("div", [], ["Hello World!"]);
    renderer($root, virtualDom);
    expect($root.innerHTML).toMatchSnapshot();
  });
});
