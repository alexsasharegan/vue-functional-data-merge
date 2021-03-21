import { mergeData } from "../src/index";

it("should convert style strings to objects", () => {
  let data: Record<string, unknown>[] = [
    {
      style: " transform : translateX(-50%) ; ",
    },
    {
      style: " stroke-dashoffset : 150px ; ",
    },
    {
      // tests valid extra prop separators `:`,
      // list separators `;`, and trailing props without a terminating `;`
      style: `
      background: url("https://unsplash.com/photos/xSPd2ifk5L8");
      background-image: url(https://foo.com/bar?baz;biz;);
      background-position: center center
      content: "Hello!"`,
    },
    {
      style:
        "transition: stroke-dashoffset 0.3s;transform: rotate(-90deg); transform-origin: 50% 50%; ",
    },
  ];

  let expected = {
    style: [
      {
        transition: "stroke-dashoffset 0.3s",
        transform: "rotate(-90deg)",
        transformOrigin: "50% 50%",
      },
      {
        background: `url("https://unsplash.com/photos/xSPd2ifk5L8")`,
        backgroundImage: `url(https://foo.com/bar?baz;biz;)`,
        backgroundPosition: "center center",
      },
      { strokeDashoffset: "150px" },
      { transform: "translateX(-50%)" },
    ],
  };

  expect(mergeData(...data)).toEqual(expected);
});

it("should execute array merge on class, style, directive properties", () => {
  let vd1: Record<string, unknown> = {
    class: ["a", { b: true, c: false }],
    style: ["display:block;", { color: "red", fontSize: "16px" }],
  };
  let vd2: Record<string, unknown> = {
    class: ["d", { e: true, f: false }],
    style: "position:absolute;",
  };

  let actual = mergeData(vd1, vd2);
  let expected = {
    class: ["a", "d", { e: true, f: false, b: true, c: false }],
    style: [
      { position: "absolute" },
      { display: "block" },
      { color: "red", fontSize: "16px" },
    ],
  };

  // Check values recursively
  expect(actual).toEqual(expected);
  // Check that root object refs do not match
  expect(actual).not.toBe(expected);
  // Check that level 1 object refs do not match
  expect(actual.class).not.toBe(vd1.class);
  expect(actual.style).not.toBe(vd1.style);
  expect(actual.style).not.toBe(vd2.style);
});
