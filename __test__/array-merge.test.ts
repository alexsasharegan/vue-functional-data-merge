import { VNodeData, VNodeDirective } from "vue"
import { mergeData } from "../src/index"

it("should execute array merge on class, style, directive properties", () => {
	let vd1: VNodeData = {
		class: ["a", { b: true, c: false }],
		style: ["display:block;", { color: "red", fontSize: "16px" }],
	}
	let vd2: VNodeData = {
		class: ["d", { e: true, f: false }],
		style: "position:absolute;",
	}

	let actual = mergeData(vd1, vd2)
	let expected = {
		class: ["d", { e: true, f: false }, "a", { b: true, c: false }],
		style: ["position:absolute;", "display:block;", { color: "red", fontSize: "16px" }],
	}

	// Check values recursively
	expect(actual).toEqual(expected)
	// Check that root object refs do not match
	expect(actual).not.toBe(expected)
	// Check that level 1 object refs do not match
	expect(actual.class).not.toBe(vd1.class)
	expect(actual.class).not.toBe(vd2.class)
	expect(actual.style).not.toBe(vd1.style)
	expect(actual.style).not.toBe(vd2.style)
})

it("should init types to array", () => {
	let test = mergeData({ class: "string" })
	expect(Array.isArray(test.class)).toBe(true)

	test = mergeData({ class: { string: true } })
	expect(Array.isArray(test.class)).toBe(true)

	test = mergeData({ class: ["string"] })
	expect(Array.isArray(test.class)).toBe(true)
})
