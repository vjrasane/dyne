import { Cmd, Update } from "~/engine";

import compose from "~/compose";

describe("compose", () => {
  describe("model", () => {
    const update = id => (msg, model) => ({
      ...model,
      id,
      msg,
      status: "updated"
    });

    it("updates single field correctly", () => {
      const composed = compose({
        child: update("single")
      });

      const model = { child: { field: "value" } };
      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });

    it("updates embedded field correctly", () => {
      const composed = compose({
        firstChild: {
          secondChild: {
            thirdChild: update("embedded")
          }
        }
      });

      const model = {
        firstChild: {
          secondChild: {
            thirdChild: {
              field: "value"
            }
          }
        }
      };

      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });

    it("updates array of fields somewhat correctly", () => {
      const composed = compose({
        array: [update(0), update(1), update(2)]
      });

      const model = {
        array: [{ field: 0 }, { field: 1 }, { field: 2 }]
      };

      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });

    it("keeps constant value", () => {
      const composed = compose({
        constant: "value"
      });

      const updated = composed("message", {});
      expect(updated).toMatchSnapshot();
    });

    it("updates missing field", () => {
      const composed = compose({
        missing: {
          field: update("missing")
        }
      });

      const updated = composed("message", {});
      expect(updated).toMatchSnapshot();
    });

    it("updates complex structure correctly", () => {
      const composed = compose({
        firstChild: update("first"),
        secondChild: update("second"),
        thirdChild: update("third"),
        embeddedChild: {
          embedded: update("embedded"),
          constant: "embedded"
        },
        constant: "value"
      });

      const model = {
        firstChild: { field: "first" },
        secondChild: { field: "second" },
        thirdChild: { field: "third" },
        embeddedChild: {
          embedded: { field: "embedded" }
        }
      };

      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });
  });

  describe("command", () => {
    const update = () => Cmd(() => "result");

    it("returns single command correctly", () => {
      const composed = compose({
        child: update
      });

      const model = { child: { field: "value" } };
      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });

    it("returns embedded command correctly", () => {
      const composed = compose({
        firstChild: {
          secondChild: {
            thirdChild: update
          }
        }
      });

      const model = {
        firstChild: {
          secondChild: {
            thirdChild: {
              field: "value"
            }
          }
        }
      };

      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });

    it("returns array of commands somewhat correctly", () => {
      const composed = compose({
        array: [update, update, update]
      });

      const model = {
        array: [{ field: 0 }, { field: 1 }, { field: 2 }]
      };

      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });

    it("keeps constant value", () => {
      const composed = compose({
        constant: "value"
      });

      const updated = composed("message", {});
      expect(updated).toMatchSnapshot();
    });

    it("updates missing field", () => {
      const composed = compose({
        missing: {
          field: update
        }
      });

      const updated = composed("message", {});
      expect(updated).toMatchSnapshot();
    });

    it("returns complex command structure correctly", () => {
      const composed = compose({
        firstChild: update,
        secondChild: update,
        thirdChild: update,
        embeddedChild: {
          embedded: update,
          constant: "embedded"
        },
        constant: "value"
      });

      const model = {
        firstChild: { field: "first" },
        secondChild: { field: "second" },
        thirdChild: { field: "third" },
        embeddedChild: {
          embedded: { field: "embedded" }
        }
      };

      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });
  });

  describe("update", () => {
    const update = id => (msg, model) =>
      Update(
        {
          ...model,
          id,
          msg,
          status: "updated"
        },
        Cmd(() => "result")
      );

    it("updates single field and returns command correctly", () => {
      const composed = compose({
        child: update("single")
      });

      const model = { child: { field: "value" } };
      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });

    it("updates embedded field and returns command correctly", () => {
      const composed = compose({
        firstChild: {
          secondChild: {
            thirdChild: update("embedded")
          }
        }
      });

      const model = {
        firstChild: {
          secondChild: {
            thirdChild: {
              field: "value"
            }
          }
        }
      };

      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });

    it("updates array of fields and returns commands somewhat correctly", () => {
      const composed = compose({
        array: [update(0), update(1), update(2)]
      });

      const model = {
        array: [{ field: 0 }, { field: 1 }, { field: 2 }]
      };

      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });

    it("keeps constant value", () => {
      const composed = compose({
        constant: "value"
      });

      const updated = composed("message", {});
      expect(updated).toMatchSnapshot();
    });

    it("updates missing field", () => {
      const composed = compose({
        missing: {
          field: update("missing")
        }
      });

      const updated = composed("message", {});
      expect(updated).toMatchSnapshot();
    });

    it("updates complex field structure and returns commands correctly", () => {
      const composed = compose({
        firstChild: update("first"),
        secondChild: update("second"),
        thirdChild: update("third"),
        embeddedChild: {
          embedded: update("embedded"),
          constant: "embedded"
        },
        constant: "value"
      });

      const model = {
        firstChild: { field: "first" },
        secondChild: { field: "second" },
        thirdChild: { field: "third" },
        embeddedChild: {
          embedded: { field: "embedded" }
        }
      };

      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });
  });

  describe("nothing", () => {
    const update = () => {};

    it("keeps single field", () => {
      const composed = compose({
        child: update
      });

      const model = { child: { field: "value" } };
      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });

    it("keeps embedded field", () => {
      const composed = compose({
        firstChild: {
          secondChild: {
            thirdChild: update
          }
        }
      });

      const model = {
        firstChild: {
          secondChild: {
            thirdChild: {
              field: "value"
            }
          }
        }
      };

      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });

    it("keeps array of fields somewhat", () => {
      const composed = compose({
        array: [update, update, update]
      });

      const model = {
        array: [{ field: 0 }, { field: 1 }, { field: 2 }]
      };

      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });

    it("keeps constant value", () => {
      const composed = compose({
        constant: "value"
      });

      const updated = composed("message", {});
      expect(updated).toMatchSnapshot();
    });

    it("keeps missing field", () => {
      const composed = compose({
        missing: {
          field: update
        }
      });

      const updated = composed("message", {});
      expect(updated).toMatchSnapshot();
    });

    it("keeps complex field structure", () => {
      const composed = compose({
        firstChild: update,
        secondChild: update,
        thirdChild: update,
        embeddedChild: {
          embedded: update,
          constant: "embedded"
        },
        constant: "value"
      });

      const model = {
        firstChild: { field: "first" },
        secondChild: { field: "second" },
        thirdChild: { field: "third" },
        embeddedChild: {
          embedded: { field: "embedded" }
        }
      };

      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });
  });

  describe("combination", () => {
    const updateModel = id => (msg, model) => ({
      ...model,
      id,
      msg,
      status: "updated"
    });

    const updateCmd = () => Cmd(() => "result");

    const updateBoth = id => (msg, model) =>
      Update(updateModel(id)(msg, model), updateCmd());

    const updateNothing = () => {};

    it("updates complex field structure and returns commands correctly", () => {
      const composed = compose({
        model: updateModel("model"),
        cmd: updateCmd,
        both: updateBoth("both"),
        nothing: updateNothing,
        constant: "value",
        embedded: {
          model: updateModel("model"),
          cmd: updateCmd,
          both: updateBoth("both"),
          nothing: updateNothing,
          constant: "embedded"
        }
      });

      const model = {
        model: { field: "model" },
        cmd: { field: "cmd" },
        both: { field: "both" },
        nothing: { field: "nothing" },
        embedded: {
          model: { field: "model" },
          cmd: { field: "cmd" },
          both: { field: "both" },
          nothing: { field: "nothing" }
        }
      };

      const updated = composed("message", model);
      expect(updated).toMatchSnapshot();
    });
  });
});
