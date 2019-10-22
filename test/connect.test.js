import { Cmd, Update } from "~/engine";
import { Lens } from "~/optical";

import connector from "~/connect";

const localUpdate = id => (msg, model) => ({
  ...model,
  id,
  msg,
  status: "updated"
});

describe("connect", () => {
  let connect, update;
  beforeEach(() => {
    ({ connect, update } = connector());
  });

  it("connects single update with field name", () => {
    connect(
      "field",
      localUpdate("single update")
    );

    const model = {
      field: {
        data: "single update"
      }
    };

    const updated = update("message", model);
    expect(updated).toMatchSnapshot();
  });

  it("connects single update with field path array", () => {
    connect(
      ["field"],
      localUpdate("single update")
    );

    const model = {
      field: {
        data: "single update"
      }
    };

    const updated = update("message", model);
    expect(updated).toMatchSnapshot();
  });

  it("connects single update with lens", () => {
    connect(
      Lens.field("field"),
      localUpdate("single update")
    );

    const model = {
      field: {
        data: "single update"
      }
    };

    const updated = update("message", model);
    expect(updated).toMatchSnapshot();
  });

  it("connects single update to missing field", () => {
    connect(
      "field",
      localUpdate("single update")
    );

    const updated = update("message", {});
    expect(updated).toMatchSnapshot();
  });

  it("connects single embedded update with field path array", () => {
    connect(
      ["firstChild", "secondChild", "thirdChild"],
      localUpdate("embedded child")
    );

    const model = {
      firstChild: {
        secondChild: {
          thirdChild: {
            data: "embedded child"
          }
        }
      }
    };

    const updated = update("message", model);
    expect(updated).toMatchSnapshot();
  });

  it("connects single embedded update with lens", () => {
    connect(
      Lens.path("firstChild", "secondChild", "thirdChild"),
      localUpdate("embedded child")
    );

    const model = {
      firstChild: {
        secondChild: {
          thirdChild: {
            data: "embedded child"
          }
        }
      }
    };

    const updated = update("message", model);
    expect(updated).toMatchSnapshot();
  });

  it("connects single embedded update to missing field", () => {
    connect(
      ["firstChild", "secondChild", "thirdChild"],
      localUpdate("single update")
    );

    const updated = update("message", {});
    expect(updated).toMatchSnapshot();
  });

  it("connects multiple updates", () => {
    connect(
      "firstChild",
      localUpdate("first child")
    );
    connect(
      ["secondChild"],
      localUpdate("second child")
    );
    connect(
      Lens.field("thirdChild"),
      localUpdate("third child")
    );

    const model = {
      firstChild: {
        data: "first child"
      },
      secondChild: {
        data: "second child"
      },
      thirdChild: {
        data: "third child"
      }
    };

    const updated = update("message", model);
    expect(updated).toMatchSnapshot();
  });

  it("connects complex updates", () => {
    connect(
      "firstChild",
      localUpdate("first child")
    );
    connect(
      ["secondChild", "thirdChild"],
      localUpdate("third child")
    );
    connect(
      Lens.field("fourthChild", "fifthChild", "sixthChild"),
      localUpdate("sixth child")
    );

    const model = {
      firstChild: {
        data: "first child"
      },
      secondChild: {
        thirdChild: {
          data: "third child"
        }
      },
      fourthChild: {
        fifthChild: {
          sixthChild: {
            data: "sixth child"
          }
        }
      }
    };

    const updated = update("message", model);
    expect(updated).toMatchSnapshot();
  });

  it("connects complex updates to missing fields", () => {
    connect(
      "firstChild",
      localUpdate("first child")
    );
    connect(
      ["secondChild", "thirdChild"],
      localUpdate("third child")
    );
    connect(
      Lens.path("fourthChild", "fifthChild", "sixthChild"),
      localUpdate("sixth child")
    );

    const updated = update("message", {});
    expect(updated).toMatchSnapshot();
  });
});
