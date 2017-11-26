const { mergeData } = require("../dist/lib.common")
const { Suite } = require("benchmark")

let mergeSuite = new Suite("mergeData", {
	onCycle(e) {
		console.log(e.target.toString())
	},
})

let tests = []

tests.push(function basic() {
	mergeData(
		{
			staticClass: "btn",
			class: { "btn-primary": true },
		},
		{ class: ["btn-block"] }
	)
})

tests.push(function multi() {
	mergeData(
		{ staticClass: "btn", class: { "btn-primary": true } },
		{ class: ["btn-block"] },
		{ on: { click() {}, mouseup() {} } },
		{ on: { click() {}, mouseup() {} } },
		{ class: { "text-center": true } }
	)
})

for (const fn of tests) {
	mergeSuite.add(fn.name, fn)
}

mergeSuite.run()
