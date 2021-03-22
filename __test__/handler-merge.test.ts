import { mergeData } from "../src/index";

it("should not mutate original object (issue #2)", () => {
  let def1 = { onClick() {} };
  let def2 = { onClick() {} };

  let onclick1 = def1.onClick;
  let onclick2 = def2.onClick;

  let data = mergeData({}, def1, def2);

  expect(def1.onClick).toBe(onclick1);
  expect(def2.onClick).toBe(onclick2);

  expect(data.onClick).toContain(onclick1);
  expect(data.onClick).toContain(onclick2);
});

it("should set single handlers and concat multi", () => {
  let h1 = console.log;
  let h2 = console.info;
  let h3 = console.error;
  let actual: Record<string, unknown>;

  actual = mergeData(
    { class: ["btn", "text-center"] },
    { onMouseup: h1 }
  );
  expect(actual).toMatchObject({ onMouseup: h1 });
  expect(Array.isArray(actual.onMouseup)).toBe(false);

  actual = mergeData(
    { onMouseup: h1 },
    { class: ["btn", "text-center"] }
  );
  expect(actual).toMatchObject({ onMouseup: h1 });
  expect(Array.isArray(actual.onMouseup)).toBe(false);

  actual = mergeData(
    { onMouseup: h1 },
    { onMouseup: h2 },
    { onMouseup: h3 }
  );
  expect(Array.isArray(actual.onMouseup)).toBe(true);
  expect(actual.onMouseup).toContain(h1);
  expect(actual.onMouseup).toContain(h2);
  expect(actual.onMouseup).toContain(h3);
});

it("should call the right-most argument first", () => {
  let first = 0;
  let factory = (n: number) => () => {
    if (!first) {
      first = n;
    }
  };

  let actual = mergeData(
    { onClick: factory(1) },
    { onClick: factory(2) },
    { onClick: factory(3) },
    { onClick: factory(4) }
  );

  expect(Array.isArray(actual.onClick)).toBe(true);
  if (!Array.isArray(actual.onClick)) {
    throw new TypeError();
  }

  for (const fn of actual.onClick) {
    fn();
  }
  expect(first).toBe(4);
  expect(actual).toMatchSnapshot("merge-4");
});
