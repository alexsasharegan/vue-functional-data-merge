var mergeData=function(e){"use strict";var a=Object.assign||function(e){for(var a,s=1,t=arguments.length;s<t;s++){a=arguments[s];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e};return e.mergeData=function(){for(var e,s,t={},r=arguments.length;r--;)for(var c=0,o=Object.keys(arguments[r]);c<o.length;c++)switch(e=o[c]){case"class":case"style":case"directives":Array.isArray(t[e])||(t[e]=[]),t[e]=t[e].concat(arguments[r][e]);break;case"staticClass":if(!arguments[r][e])break;void 0===t[e]&&(t[e]=""),t[e]&&(t[e]+=" "),t[e]+=arguments[r][e].trim();break;case"on":case"nativeOn":t[e]||(t[e]={});for(var n=0,i=Object.keys(arguments[r][e]);n<i.length;n++)s=i[n],t[e][s]?t[e][s]=[].concat(t[e][s],arguments[r][e][s]):t[e][s]=arguments[r][e][s];break;case"attrs":case"props":case"domProps":case"scopedSlots":case"staticStyle":case"hook":case"transition":t[e]||(t[e]={}),t[e]=a({},arguments[r][e],t[e]);break;case"slot":case"key":case"ref":case"tag":case"show":case"keepAlive":default:t[e]||(t[e]=arguments[r][e])}return t},e}({});
//# sourceMappingURL=lib.js.map
