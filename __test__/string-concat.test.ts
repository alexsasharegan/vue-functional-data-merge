import { mergeData, VNodeData } from "../src/index";

it("should concatenate strings", () => {
  let test: VNodeData[] = [
    { class: "" },
    { class: "class-1" },
    { class: "class-2" },
    { class: "" },
    { class: "class-3" },
  ];
  let actual = mergeData(...test);

  expect(actual.class).toEqual(
    expect.arrayContaining(["class-3", "class-2", "class-1"])
  );
});
