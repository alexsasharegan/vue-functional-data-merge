import { VNodeData, VNodeDirective } from "vue"
import { mergeData } from "../src/index"

it("should handle multiple arguments", () => {
	// Pre-define functions so they compare equal
	function click() {}
	function mouseup() {}

	let expected: VNodeData = {
		staticClass: "btn ml-auto",
		class: [{ "text-center": true }, "btn-block", { "btn-primary": true }],
		on: {
			click: [click, click],
			mouseup: [mouseup, mouseup],
		},
	}

	let actual = mergeData(
		{ staticClass: "ml-auto" },
		{ staticClass: "btn", class: { "btn-primary": true } },
		{ class: ["btn-block"] },
		{ on: { click, mouseup } },
		{ on: { click, mouseup } },
		{ class: { "text-center": true } }
	)

	expect(actual).toEqual(expected)
})

it("should work like in the example", () => {
	let onClick1 = e => alert("💥")
	let onClick2 = e => alert("👍")

	let componentData: VNodeData = {
		staticClass: "fn-component", // concatenates all static classes
		class: {
			active: true,
			"special-class": false,
		},
		attrs: {
			id: "my-functional-component",
		},
		on: {
			click: onClick1,
		},
	}
	// <my-btn variant="primary" type="submit" id="form-submit-btn" @click="onClick">Submit</my-btn>
	let templateData: VNodeData = {
		attrs: {
			id: "form-submit-btn",
			type: "submit",
		},
		on: { click: onClick2 },
	}

	expect(mergeData(templateData, componentData)).toEqual({
		staticClass: "fn-component",
		class: expect.arrayContaining([
			{
				active: true,
				"special-class": false,
			},
		]),
		attrs: {
			id: "my-functional-component",
			type: "submit",
		},
		on: { click: expect.arrayContaining([onClick1, onClick2]) },
	})
})
