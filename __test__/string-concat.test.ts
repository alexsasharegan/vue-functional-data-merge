import { VNodeData, VNodeDirective } from "vue";
import { mergeData } from "../src/index";

it("should concatenate strings", () => {
  let test: VNodeData[] = [
    { staticClass: "" },
    { staticClass: "class-1" },
    { staticClass: "class-2" },
    { staticClass: "" },
    { staticClass: "class-3" },
  ];
  let actual = mergeData(...test);

  expect(actual.staticClass).toBe("class-3 class-2 class-1");
});
