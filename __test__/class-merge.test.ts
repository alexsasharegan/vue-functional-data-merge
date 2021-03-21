import { mergeData } from "../src/index";

it("should find and merge class objects in arrays", () => {
  let data: Record<string, unknown>[] = [
    {
      class: "btn",
    },
    {
      class: ["test", {test2: true, test3: false}],
    },
    {
      class: {
        toggle: true,
        warning: false
      }
    },
    {
      class: ["container-child"],
    },
  ];

  let expected = {
    class: [
      "btn",
      "container-child",
      "test",
      {
        toggle: true,
        warning: false,
        test2: true,
        test3: false
      },
    ],
  };

  expect(mergeData(...data).class).toEqual(expect.arrayContaining(expected.class as any[]));
});

it("should append a class object if the target is an array with only strings", () => {
  const data: Record<string, unknown>[] = [
    {
      class: ["btn", "container-child"],
    },
    {
      class: {
        toggle: true,
        warning: false
      }
    },
  ];

  const data2: Record<string, unknown>[] = [
    {
      class: ["btn", "container-child"],
    },
    {
      class: [{
        toggle: true,
        warning: false
      }]
    },
  ];

  const expected = {
    class: ["btn", "container-child", {toggle: true, warning: false}]
  };

  const actual = mergeData(...data);
  const actual2 = mergeData(...data2);

  expect(actual).toEqual(expected);
  expect(actual2).toEqual(expected)
});

it("Should avoid merging duplicate classes", () => {
  const data = [
    {
      class: ["test", "test2", "test3", "test4"],
    },
    {
      class: ["test2", "test5", "test0", "test", "test4"]
    }
  ]

  const expected = {
    class: ["test", "test2", "test3", "test4", "test5", "test0"]
  }

  const actual = mergeData(...data);
  expect(actual).toEqual(expected);
});

it("should handle undefined class values", () => {
  const data = [
    {
      class: undefined,
    },
    {
      class: 'test'
    }
  ]

  const expected = {
    class: 'test',
  }

  const actual = mergeData(...data);
  expect(actual).toEqual(expected)
})

it("should overwrite class object properties on merging class objects", () => {
  const data = [
    {
      class: {test1: true, test2: false}
    },
    {
      class: {test1: false, test4: true}
    }
  ]

  const expected = {
    class: {test1: false, test2: false, test4: true}
  }

  const actual = mergeData(...data);
  expect(actual).toEqual(expected);
})

it("Should deconstruct arrays back to an object if the result is an array with only one object", () => {
  const data = [
    {
      class: [{test1: true, test2: false}]
    },
    {
      class: [{test2: true, test3: false, test4: true}],
    },
    {
      class: [{test1: false, test2: false, test4: true}]
    },
  ]

  const expected = {
    class: {test1: false, test2: false, test3: false, test4: true}
  }

  const actual = mergeData(...data);
  expect(actual).toEqual(expected);
})