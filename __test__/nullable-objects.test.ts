import { mergeData, VNodeData } from "../src/index";

it("should handle nested nullable objects as initial state", () => {
  let testData: VNodeData[] = [
    {
      style: undefined,
    },
    {
      class: "foo",
    },
  ];
  let actual: VNodeData;
  let boom = () => {
    actual = mergeData(...testData);
  };

  expect(boom).not.toThrowError();
  expect(actual.class).toEqual(["foo"]);
  expect(actual.style).toBeUndefined();
});
