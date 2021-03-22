import { mergeClass, AttrsClass } from "./mergeClass";

const pattern = {
  kebab: /-(\w)/g,
  styleProp: /:(.*)/,
	styleList: /;(?![^(]*\))/g,
} as const;

function camelReplace(_substr: string, match: string) {
  return match.toUpperCase();
}

function camelCase(str: string) {
  return str.replace(pattern.kebab, camelReplace);
}

function parseStyle(style: string) {
  let styleMap: Record<string, any> = {};

  for (let s of style.split(pattern.styleList)) {
    let [key, val] = s.split(pattern.styleProp);
    key = key.trim();
    if (!key) {
      continue;
    }
    // May be undefined if the `key: value` pair is incomplete.
    val = val.trim();
    styleMap[camelCase(key)] = val;
  }

  return styleMap;
}

/**
 * Intelligently merges data for createElement.
 * Merges arguments left to right, preferring the right argument.
 * Returns new attributes (Record<string, unknown>) object.
 */
function mergeData(...vNodeData: Record<string, unknown>[]): Record<string, unknown>;
function mergeData(): Record<string, unknown> {
  let mergeTarget: Record<string, unknown> = {};
  let i: number = arguments.length;
  let prop: string;

  // Allow for variadic argument length.
  while (i--) {
    // Iterate through the data properties and execute merge strategies
    // Object.keys eliminates need for hasOwnProperty call
    for (prop of Object.keys(arguments[i])) {
      switch (prop) {
        // class merge strategy (parse clas objects, and merge to an array containing strings and max 1 object for conditionals)
        case "class":
          mergeTarget[prop] = mergeClass(arguments[i][prop] as AttrsClass, mergeTarget[prop] as AttrsClass);
          continue;
        //merge style by concatenating arrays
        case "style": {
          if (!Array.isArray(mergeTarget[prop])) {
            mergeTarget[prop] = [];
          }

          let style: any[];
          if (Array.isArray(arguments[i].style)) {
            style = arguments[i].style;
          } else {
            style = [arguments[i].style];
          }
          for (let j = 0; j < style.length; j++) {
            let s = style[j];
            if (typeof s === "string") {
              style[j] = parseStyle(s);
            }
          }
          if(style === undefined || style === null || style.every(x => x === undefined || x === null)) style = [];
          mergeTarget[prop] = (mergeTarget[prop] as Record<string, unknown>[]).concat(style);
          continue;
        }

        case "id":
        case "key":
        case "ref":
        case "keepAlive": {
          if (!mergeTarget[prop]) {
            mergeTarget[prop] = arguments[i][prop];
          }
          continue;
        }
      }

      if (prop.startsWith('on') && prop !== 'on') {
        // Object, the properties of which to merge via array merge strategy (array concatenation).
        // Callback merge strategy merges callbacks to the beginning of the array,
        // so that the last defined callback will be invoked first.
        // This is done since to mimic how Object.assign merging
        // uses the last given value to assign.

        // Concat function to array of functions if callback present.
        if (mergeTarget[prop] && !Array.isArray(mergeTarget[prop])) {
          // Insert current iteration data in beginning of merged array.
          mergeTarget[prop] = [
            mergeTarget[prop],
            arguments[i][prop]
          ]
          continue;
        } else if (Array.isArray(mergeTarget[prop])) {
          if(Array.isArray(arguments[i][prop])) {
            (mergeTarget[prop] as unknown[]).push(...arguments[i][prop])
          } else {
            (mergeTarget[prop] as unknown[]).push(arguments[i][prop])
          }
          continue;
        }
      }

      mergeTarget[prop] = arguments[i][prop];
    }
  }

  return mergeTarget;
}

export { mergeData };
