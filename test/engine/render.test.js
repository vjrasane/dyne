import { renderer } from "~/engine/render";
import DyneElement from "~/element";

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
    const virtualDom = new DyneElement("div", [], ["Hello World!"]);
    renderer($root, virtualDom);
    expect($root.innerHTML).toMatchSnapshot();
  });
});
