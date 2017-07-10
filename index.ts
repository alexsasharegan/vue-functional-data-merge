import { VNodeData } from "./types/vnode"
const { assign, keys } = Object

type concat = {
    (...items: any[]): any[]
    (...items: any[][]): any[]
}

function concat() {
    return Array.prototype.concat.apply([], arguments)
}

/**
 * Intelligently merges data for createElement.
 * Merges arguments left to right, preferring the right argument.
 * Returns new VNodeData object.
 */
type mergeData = {
    (...vNodeData: VNodeData[]): VNodeData
}
export default function mergeData() {
    // Start by copying the first arg into a fresh object
    let mergeTarget = assign({}, arguments[0])

    // Allow for variadic argument length.
    // Skip first argument that was assigned to mergeTarget.
    for (let i = 1; i < arguments.length; i++) {
        // Iterate through the data properties and execute merge strategies
        // Object.keys eliminates need for hasOwnProperty call
        for (const prop of keys(arguments[i])) {
            // If strictly undefined, simply assign value and continue
            if (mergeTarget[prop] === undefined) {
                mergeTarget[prop] = arguments[i][prop]
                continue
            }

            switch (prop) {
                // Array merge strategy (array concatenation)
                case "class":
                case "style":
                case "directives":
                    // Repackaging in an array allows Vue runtime
                    // to merge class/style bindings regardless of type.
                    mergeTarget[prop] = concat(mergeTarget[prop], arguments[i][prop])
                    break

                // Space delimited string concatenation strategy
                case "staticClass":
                    // If we get here,
                    // value !== undefined,
                    // but it could still be an empty string.
                    if (mergeTarget[prop]) {
                        // Not an empty string, so concatenate
                        mergeTarget[prop] = mergeTarget[prop].trim() + " "
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
                    for (const event of keys(arguments[i][prop])) {
                        // Insert current iteration data in beginning of merged array.
                        mergeTarget[prop][event] = concat(arguments[i][prop][event], mergeTarget[prop][event])
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
                    mergeTarget[prop] = assign({}, mergeTarget[prop], arguments[i][prop])
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
