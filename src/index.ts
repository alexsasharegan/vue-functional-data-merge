import { VNodeData } from "vue"

function concat(...items: any[]): any[]
function concat(...items: any[][]): any[]
function concat() {
	return Array.prototype.concat.apply([], arguments)
}

function cp(value: any): any {
	if (typeof value != "object" || value == null) {
		return value
	}
	if (Array.isArray(value)) {
		return [...value]
	}
	return Object.assign({}, value)
}

/**
 * Intelligently merges data for createElement.
 * Merges arguments left to right, preferring the right argument.
 * Returns new VNodeData object.
 */
function mergeData(...vNodeData: VNodeData[]): VNodeData {
	let mergeTarget: VNodeData & { [key: string]: any } = {}
	let i: number = 0
	let argLen: number = arguments.length
	let prop: string

	// Allow for variadic argument length.
	for (; i < argLen; i++) {
		// Iterate through the data properties and execute merge strategies
		// Object.keys eliminates need for hasOwnProperty call
		for (prop of Object.keys(arguments[i])) {
			// If strictly undefined, copy value and continue
			if (mergeTarget[prop] === undefined) {
				mergeTarget[prop] = cp(arguments[i][prop])
				continue
			}

			switch (prop) {
				// Array merge strategy (array concatenation)
				case "class":
				case "style":
				case "directives":
					if (!Array.isArray(mergeTarget[prop])) {
						mergeTarget[prop] = []
					}
					// Repackaging in an array allows Vue runtime
					// to merge class/style bindings regardless of type.
					mergeTarget[prop] = concat(mergeTarget[prop], arguments[i][prop])
					break

				// Space delimited string concatenation strategy
				case "staticClass":
					// undefined values are handled above.
					if (mergeTarget[prop]) {
						// Not an empty string, so concatenate
						mergeTarget[prop] += " "
					}
					mergeTarget[prop] += arguments[i][prop].trim()
					break

				// Object, the properties of which to merge via array merge strategy (array concatenation).
				// Callback merge strategy merges callbacks to the beginning of the array,
				// so that the last defined callback will be invoked first.
				// This is done since to mimic how Object.assign merging
				// uses the last given value to assign.
				case "on":
				case "nativeOn":
					// If we get here,
					// value must be of type Object.
					for (const event of Object.keys(arguments[i][prop])) {
						// Concat function to array of functions if callback present.
						if (mergeTarget[prop][event]) {
							// Insert current iteration data in beginning of merged array.
							mergeTarget[prop][event] = concat(arguments[i][prop][event], mergeTarget[prop][event])
						} else {
							// Straight assign.
							mergeTarget[prop][event] = arguments[i][prop][event]
						}
					}
					break

				// Object merge strategy
				case "attrs":
				case "props":
				case "domProps":
				case "scopedSlots":
				case "staticStyle":
				case "hook":
				case "transition":
					mergeTarget[prop] = { ...mergeTarget[prop], ...arguments[i][prop] }
					break

				// Reassignment strategy (no merge)
				case "slot":
				case "key":
				case "ref":
				case "tag":
				case "show":
				case "keepAlive":
				default:
					mergeTarget[prop] = arguments[i][prop]
			}
		}
	}

	return mergeTarget
}

export default mergeData
export { mergeData }
