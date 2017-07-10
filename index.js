var assign = Object.assign, keys = Object.keys;
var concat = function () {
    return Array.prototype.concat.apply([], arguments);
};
var mergeData = function () {
    var mergeTarget = assign({}, arguments[0]);
    for (var i = 1; i < arguments.length; i++) {
        for (var _i = 0, _a = keys(arguments[i]); _i < _a.length; _i++) {
            var prop = _a[_i];
            if (mergeTarget[prop] === undefined) {
                mergeTarget[prop] = arguments[i][prop];
                continue;
            }
            switch (prop) {
                case "class":
                case "style":
                case "directives":
                    mergeTarget[prop] = concat(mergeTarget[prop], arguments[i][prop]);
                    break;
                case "staticClass":
                    if (mergeTarget[prop]) {
                        mergeTarget[prop] = mergeTarget[prop].trim() + " ";
                    }
                    mergeTarget[prop] += arguments[i][prop].trim();
                    break;
                case "on":
                case "nativeOn":
                    for (var _b = 0, _c = keys(arguments[i][prop]); _b < _c.length; _b++) {
                        var event_1 = _c[_b];
                        mergeTarget[prop][event_1] = concat(arguments[i][prop][event_1], mergeTarget[prop][event_1]);
                    }
                    break;
                case "attrs":
                case "props":
                case "domProps":
                case "scopedSlots":
                case "staticStyle":
                case "hook":
                case "transition":
                    mergeTarget[prop] = assign({}, mergeTarget[prop], arguments[i][prop]);
                    break;
                case "slot":
                case "key":
                case "ref":
                case "tag":
                case "show":
                case "keepAlive":
                default:
                    mergeTarget[prop] = arguments[i][prop];
            }
        }
    }
    return mergeTarget;
};
//# sourceMappingURL=index.js.map