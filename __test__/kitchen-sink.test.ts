import { mergeData, VNodeData } from "../src/index";

it("should handle multiple arguments", () => {
  // Pre-define functions so they compare equal
  function click() {}
  function mouseup() {}

  let actual = mergeData(
    { class: "ml-auto" },
    { class: ["btn", { "btn-primary": true }] },
    { class: ["btn-block"] },
    { onClick: click, onMouseup: mouseup },
    { onClick: click, onMouseup: mouseup },
    { class: { "text-center": true } }
  );

  let expected: VNodeData = {
    class: [
      { "text-center": true },
      "btn-block",
      "btn",
      { "btn-primary": true },
      "ml-auto",
    ],
    onClick: [click, click],
    onMouseup: [mouseup, mouseup],
  };

  expect(actual.class).toEqual(expect.arrayContaining(expected.class as any[]));
  expect(actual.onClick).toEqual([click, click]);
  expect(actual.onMouseup).toEqual([mouseup, mouseup]);
});

it("should work like in the example", () => {
  let onClick1 = () => alert("💥");
  let onClick2 = () => alert("👍");

  let componentData: VNodeData = {
    class: [
      "fn-component",
      {
        active: true,
        "special-class": false,
      },
    ],
    id: "my-functional-component",
    onClick: onClick1,
  };

  // <my-btn variant="primary" type="submit" id="form-submit-btn" @click="onClick">Submit</my-btn>
  let templateData: VNodeData = {
    id: "form-submit-btn",
    type: "submit",
    onClick: onClick2,
  };

  expect(mergeData(templateData, componentData)).toEqual({
    class: [
      "fn-component",
      {
        active: true,
        "special-class": false,
      },
    ],
    id: "my-functional-component",
    type: "submit",
    onClick: expect.arrayContaining([onClick1, onClick2]),
  });
});
