export type VNodeData = Record<string, unknown>;

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
 * Returns new attributes (VNodeData) object.
 */
function mergeData(...vNodeData: VNodeData[]): VNodeData;
function mergeData(): VNodeData {
  let mergeTarget: VNodeData = {};
  let i: number = arguments.length;
  let prop: string;

  // Allow for variadic argument length.
  while (i--) {
    // Iterate through the data properties and execute merge strategies
    // Object.keys eliminates need for hasOwnProperty call
    for (prop of Object.keys(arguments[i])) {
      if (arguments[i][prop] == null) {
        continue;
      }

      switch (prop) {
        case "class": {
          let classes: any[] = [];
          {
            let value = mergeTarget["class"];
            if (Array.isArray(value)) {
              classes = value;
            }
          }

          // Repackaging in an array allows Vue runtime
          // to merge class/style bindings regardless of type.
          mergeTarget["class"] = classes.concat(arguments[i]["class"]);
          continue;
        }

        // merge style by concatenating arrays
        case "style": {
          let styles: any[] = [];
          {
            let value = mergeTarget.style;
            if (Array.isArray(value)) {
              styles = value;
            }
          }

          let thisStyle: any[] = [];
          if (Array.isArray(arguments[i].style)) {
            thisStyle = arguments[i].style;
          } else {
            thisStyle.push(arguments[i].style);
          }

          for (let j = 0; j < thisStyle.length; j++) {
            let s = thisStyle[j];
            if (typeof s === "string") {
              thisStyle[j] = parseStyle(s);
            }
          }

          mergeTarget[prop] = styles.concat(thisStyle);

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

      if (prop.startsWith("on") && prop !== "on") {
        // Object, the properties of which to merge via array merge strategy (array concatenation).
        // Callback merge strategy merges callbacks to the beginning of the array,
        // so that the last defined callback will be invoked first.
        // This is done since to mimic how Object.assign merging
        // uses the last given value to assign.

        // Concat function to array of functions if callback present.
        if (mergeTarget[prop] && !Array.isArray(mergeTarget[prop])) {
          // Insert current iteration data in beginning of merged array.
          mergeTarget[prop] = [mergeTarget[prop], arguments[i][prop]];
          continue;
        }

        let targetValue = mergeTarget[prop];
        let thisValue = arguments[i][prop];

        // The `else` condition falls through to a simple assignment.
        if (Array.isArray(targetValue)) {
          if (Array.isArray(thisValue)) {
            targetValue.push(...thisValue);
          } else {
            targetValue.push(thisValue);
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
