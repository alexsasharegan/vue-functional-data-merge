import { VNodeData, VNodeDirective } from "vue"
import { mergeData } from "../src/index"

it("should handle nested nullable objects as initial state", () => {
	let testData: VNodeData[] = [{ on: undefined }, { staticClass: "foo" }]
	let actual: VNodeData
	let boom = () => (actual = mergeData(...testData))

	expect(boom).not.toThrowError()
	expect(actual.staticClass).toBe("foo")
	expect(actual.on).toEqual({})
})
