import { mergeData } from "../src/index";

it("should handle multiple arguments", () => {
  // Pre-define functions so they compare equal
  function click() {}
  function mouseup() {}

  let expected: Record<string, unknown> = {
    class: ["btn", "ml-auto", "btn-block", { "text-center": true, "btn-primary": true }],
    onClick: [click, click],
    onMouseup: [mouseup, mouseup],
  };

  let actual = mergeData(
    { class: "ml-auto" },
    { class: ["btn", { "btn-primary": true } ] },
    { class: ["btn-block"] },
    { onClick: click, onMouseup: mouseup },
    { onClick: click, onMouseup: mouseup },
    { class: { "text-center": true } }
  );

  expect(actual.class).toEqual(expect.arrayContaining(expected.class as any[]))
  expect(actual.onClick).toEqual([click, click]);
  expect(actual.onMouseup).toEqual([mouseup, mouseup]);
});

it("should work like in the example", () => {
  let onClick1 = () => alert("💥");
  let onClick2 = () => alert("👍");

  let componentData: Record<string, unknown> = {
    class: [
      "fn-component",
      {
        active: true,
        "special-class": false,
      }
    ],
    id: "my-functional-component",
    onClick: onClick1,
  };

  // <my-btn variant="primary" type="submit" id="form-submit-btn" @click="onClick">Submit</my-btn>
  let templateData: Record<string, unknown> = {
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
