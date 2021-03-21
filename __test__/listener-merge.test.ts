import { mergeData } from "../src/index";

it("should concatenate event listeners when both source and target listener are an array", () => {
  function click() {}
  function mouseup() {}

  const data: Record<string, unknown>[] = [
    {
      onClick: [click, mouseup],
    },
    {
      onClick: [mouseup, click],
    }];

  const expected = {
    onClick: [mouseup, click, click, mouseup]
  };

  const actual = mergeData(...data);

  expect(actual).toEqual(expected);
});