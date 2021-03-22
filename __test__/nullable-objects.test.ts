import { mergeData } from "../src/index";

it("should handle nested nullable objects as initial state", () => {
  let testData: Record<string, unknown>[] = [{ style: undefined}, {class: "foo" }];
  let actual: Record<string, unknown>;
  let boom = () => (actual = mergeData(...testData));

  expect(boom).not.toThrowError();
  expect(actual.class).toBe("foo");
  expect(actual.style).toEqual([]);
});
