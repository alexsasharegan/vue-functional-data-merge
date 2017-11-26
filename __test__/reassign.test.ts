import { VNodeData, VNodeDirective } from "vue"
import { mergeData } from "../src/index"

it("should reassign primitives", () => {
	let override: VNodeData = { ref: "winning" }
	let vd1: VNodeData = { ref: "ref1" }
	let vd2: VNodeData = { ref: "ref2" }
	let vd3: VNodeData = { ref: "ref3" }
	let vd4: VNodeData = { ref: "ref4" }

	let actual = mergeData(vd1, vd2, vd3, vd4, override)
	expect(actual.ref).toBe("winning")
})
