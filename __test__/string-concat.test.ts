import { mergeData } from "../src/index";

it("should concatenate strings", () => {
  let test: Record<string, unknown>[] = [
    { class: "" },
    { class: "class-1" },
    { class: "class-2" },
    { class: "" },
    { class: "class-3" },
  ];
  let actual = mergeData(...test);

  expect(actual.class).toEqual(expect.arrayContaining(["class-3", "class-2", "class-1"]));
});
