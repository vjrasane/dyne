import { Lens } from "~/optical";

describe("lens", () => {
  it("returns objet itself from identity lens", () => {
    const obj = {};
    expect(Lens.identity.get(obj)).toBe(obj);
    expect(Lens.identity.set(obj, null)).toBe(obj);
  });

  it("returns field value", () => {
    const obj = {
      field: "value"
    };
    const lens = Lens.field("field");
    expect(lens.get(obj)).toBe("value");
  });

  it("returns embedded field value", () => {
    const obj = {
      firstChild: {
        secondChild: {
          thirdChild: {
            field: "value"
          }
        }
      }
    };
    const lens = Lens.path("firstChild", "secondChild", "thirdChild", "field");
    expect(lens.get(obj)).toBe("value");
  });

  it("returns same lens mapped with identity", () => {
    const obj = {
      field: "value"
    };
    const lens = Lens.identity.map(Lens.field("field"));
    expect(lens.get(obj)).toBe("value");
    expect(lens.set("new", obj)).toEqual({ field: "new" });
  });
});
