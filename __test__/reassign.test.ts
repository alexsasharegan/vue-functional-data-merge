import { mergeData } from "../src/index";

it("should reassign primitives", () => {
  let override: Record<string, unknown> = { ref: "winning" };
  let vd1: Record<string, unknown> = { ref: "ref1" };
  let vd2: Record<string, unknown> = { ref: "ref2" };
  let vd3: Record<string, unknown> = { ref: "ref3" };
  let vd4: Record<string, unknown> = { ref: "ref4" };

  let actual = mergeData(vd1, vd2, vd3, vd4, override);
  expect(actual.ref).toBe("winning");
});
