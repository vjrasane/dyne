import { element } from "../src/utils";

describe("utils", () => {
  describe("element", () => {
    it("creates minimal element", () => {
      const elem = element("div");
      expect(elem).toMatchSnapshot();
    });

    it("creates basic element", () => {
      const elem = element("div", { prop: "value" }, ["child"]);
      expect(elem).toMatchSnapshot();
    });
  });
});
