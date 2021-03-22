import { mergeData, VNodeData } from "../src/index";

it("should ignore nullable style values", () => {
  const data: VNodeData[] = [
    {
      style: undefined,
    },
    {
      style: undefined,
    },
  ];

  const expected = {};

  expect(mergeData(...data)).toEqual(expected);
});
