import engine from "../../../src/engine/core";

const html = `
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

jest.useFakeTimers();

describe("engine", () => {
  let $root;
  const initDocument = () => {
    document.body.innerHTML = html;
    $root = document.getElementById("root");
  };

  beforeEach(initDocument);

  it("starts up", () => {
    const view = jest.fn();
    const app = engine({ view });
    app({ node: $root });
    jest.advanceTimersByTime(1000);
    expect(view).toHaveBeenCalledTimes(1);
  });
});
