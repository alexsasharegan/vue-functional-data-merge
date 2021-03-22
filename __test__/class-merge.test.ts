import { mergeData, VNodeData } from "../src/index";

it("should concat objects in arrays", () => {
  let data: VNodeData[] = [
    {
      class: "btn",
    },
    {
      class: [
        "test",
        {
          test2: true,
          test3: false,
        },
      ],
    },
    {
      class: {
        toggle: true,
        warning: false,
      },
    },
    {
      class: ["container-child"],
    },
  ];

  let expected = {
    class: [
      "container-child",
      {
        toggle: true,
        warning: false,
      },
      "test",
      {
        test2: true,
        test3: false,
      },
      "btn",
    ],
  };

  expect(mergeData(...data).class).toEqual(
    expect.arrayContaining(expected.class as any[])
  );
});

it("Should concatenate string classes", () => {
  const data = [
    {
      class: ["test", "test2", "test3", "test4"],
    },
    {
      class: ["test2", "test5", "test0", "test", "test4"],
    },
  ];

  const expected = {
    class: [
      "test2",
      "test5",
      "test0",
      "test",
      "test4",
      "test",
      "test2",
      "test3",
      "test4",
    ],
  };

  const actual = mergeData(...data);
  expect(actual).toEqual(expected);
});

it("should ignore nullable class values", () => {
  const data: VNodeData[] = [
    {
      class: undefined,
    },
    {
      class: undefined,
    },
    {
      class: "test",
    },
  ];

  const expected = {
    class: ["test"],
  };

  expect(mergeData(...data)).toEqual(expected);
});

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
