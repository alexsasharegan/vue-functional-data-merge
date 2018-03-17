import { VNodeData, VNodeDirective } from "vue";
import { mergeData } from "../src/index";

it("should not mutate original object (issue #2)", () => {
  let def1 = { on: { click() {} } };
  let def2 = { on: { click() {} } };

  let onclick1 = def1.on.click;
  let onclick2 = def2.on.click;

  let data = mergeData({}, def1, def2);

  expect(def1.on).not.toBe(data.on);
  expect(def2.on).not.toBe(data.on);

  expect(def1.on.click).toBe(onclick1);
  expect(def2.on.click).toBe(onclick2);

  expect(data.on.click).toContain(onclick1);
  expect(data.on.click).toContain(onclick2);
});

it("should set single handlers and concat multi", () => {
  let h1 = console.log;
  let h2 = console.info;
  let h3 = console.error;
  let actual: VNodeData;

  actual = mergeData(
    { class: ["btn", "text-center"] },
    { on: { mouseup: h1 } }
  );
  expect(actual).toMatchObject({ on: { mouseup: h1 } });
  expect(Array.isArray(actual.on.mouseup)).toBe(false);

  actual = mergeData(
    { nativeOn: { mouseup: h1 } },
    { class: ["btn", "text-center"] }
  );
  expect(actual).toMatchObject({ nativeOn: { mouseup: h1 } });
  expect(Array.isArray(actual.nativeOn.mouseup)).toBe(false);

  actual = mergeData(
    { on: { mouseup: h1 } },
    { on: { mouseup: h2 } },
    { on: { mouseup: h3 } }
  );
  expect(Array.isArray(actual.on.mouseup)).toBe(true);
  expect(actual.on.mouseup).toContain(h1);
  expect(actual.on.mouseup).toContain(h2);
  expect(actual.on.mouseup).toContain(h3);
});

it("should call the right-most argument first", () => {
  let first = 0;
  let factory = n => () => {
    if (!first) {
      first = n;
    }
  };

  let actual = mergeData(
    { on: { click: factory(1) } },
    { on: { click: factory(2) } },
    { on: { click: factory(3) } },
    { on: { click: factory(4) } }
  );

  expect(Array.isArray(actual.on.click)).toBe(true);
  for (const fn of actual.on.click) {
    fn();
  }
  expect(first).toBe(4);
  expect(actual).toMatchSnapshot("merge-4");
});
