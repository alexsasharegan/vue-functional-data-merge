# vue-functional-data-merge

[![npm](https://img.shields.io/npm/v/vue-functional-data-merge.svg?style=for-the-badge)](https://img.shields.io/npm/v/vue-functional-data-merge)
[![npm downloads](https://img.shields.io/npm/dt/vue-functional-data-merge.svg?style=for-the-badge)](https://www.npmjs.com/package/vue-functional-data-merge)
[![GitHub stars](https://img.shields.io/github/stars/alexsasharegan/vue-functional-data-merge.svg?style=for-the-badge)](https://github.com/alexsasharegan/vue-functional-data-merge/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/alexsasharegan/vue-functional-data-merge.svg?style=for-the-badge)](https://github.com/alexsasharegan/vue-functional-data-merge/issues)
[![Travis](https://img.shields.io/travis/alexsasharegan/vue-functional-data-merge.svg?style=for-the-badge)](https://github.com/alexsasharegan/vue-functional-data-merge)
[![Coverage Status](https://img.shields.io/coveralls/github/alexsasharegan/vue-functional-data-merge.svg?style=for-the-badge)](https://coveralls.io/github/alexsasharegan/vue-functional-data-merge)
[![GitHub license](https://img.shields.io/github/license/alexsasharegan/vue-functional-data-merge.svg?style=for-the-badge)](https://github.com/alexsasharegan/vue-functional-data-merge/blob/master/LICENSE.md)

Vue.js util for intelligently merging data passed to functional components. (0.8K => 0.4K gzipped)

## Getting Started

Load the util from npm:

```sh
# NPM:
npm i vue-functional-data-merge

# Yarn:
yarn add vue-functional-data-merge
```

Now import and use it in your functional component declaration:

```js
// MyFunctionalComponent.js

// ESM
import { mergeData } from "vue-functional-data-merge"
// Common JS
const { mergeData } = require("vue-functional-data-merge/dist/lib.common.js")

export default {
	name: "my-functional-component",
	functional: true,
	props: ["foo", "bar", "baz"],
	render(h, { props, data, children }) {
		const componentData = {
			staticClass: "fn-component", // concatenates all static classes
			class: {
				// object|Array|string all get merged and preserved
				active: props.foo,
				"special-class": props.bar,
			},
			attrs: {
				id: "my-functional-component", // now overrides any id placed on the component
			},
			on: {
				// Event handlers are merged to an array of handlers at each event.
				// The last data object passed to `mergeData` will have it's event handlers called first.
				// Right-most arguments are prepended to event handler array.
				click(e) {
					alert(props.baz)
				},
			},
		}

		return h("div", mergeData(data, componentData), children)
	},
}
```

## Why do I need this util?

When writing functional Vue components, the render function receives a `context.data` object
([see vue docs](https://vuejs.org/v2/guide/render-function.html#Functional-Components)). This object that contains the
entire data object passed to the component (the shape of which
[can be found here](https://vuejs.org/v2/guide/render-function.html#The-Data-Object-In-Depth)). In order to write
flexible components, the data object used to create the component must be merged with the data received. If not, only
the properties defined by the component will be rendered.

Consider this example:

```js
// MyBtn.js
export default {
	name: "my-btn",
	props: ["variant"],
	functional: true,
	render(h, { props, children }) {
		return h(
			"button",
			{
				staticClass: "btn",
				class: [`btn-${props.variant}`],
				attrs: { type: "button" },
			},
			children
		)
	},
}
```

This exports a functional button component that applies a base `.btn` class and a `.btn-<variant>` class based on the
`variant` prop passed to the component. It's just a simple wrapper around some Bootstrap styling to make repetitive
usage simpler. Usage would look like this:

```html
<template>
	<form>
		<input type="text" placeholder="Name" required>
		<input type="email" placeholder="email" required>
		<my-btn variant="primary" type="submit" id="form-submit-btn" @click="onClick">Submit</my-btn>
	</form>
</template>
```

We've used our Bootstrap button component in a form and conveniently applied the `primary` variant, but we also wanted
to change the button `type` from `button` to `submit`, give it an `id`, and attach a click handler. This won't work
because we haven't passed the attributes, listeners, etc. to the create element call in the component's render function.

To fix this, we might extract out props, merge listeners/attributes, etc. This works well, but gets verbose fast when
attempting to support all dom attributes, event listeners, etc. One might think to simply use Object spread or
`Object.assign` to solve this like so:

```js
return h("button", { ...context.data, ...componentData }, children)
```

Now when we try to add any dom attributes, Object spread is essentially performing something like this:

```js
Object.assign(
	{},
	{
		props: { variant: "primary" },
		attrs: { id: "form-submit-btn", type: "submit" }
		on: { click: onClick }
	},
	{
		staticClass: "btn",
		class: [`btn-${props.variant}`],
		attrs: { type: "button" },
		on: {
			click() {
				alert("Hello from MyBtn!")
			}
		}
	}
)
```

The component data will wipe out all the context's `attrs` and `on` handlers as `Object.assign` merges these properties.
This is where the `mergeData` util can help you. It will dig into the nested properties of the `context.data` and apply
different merge strategies for each data property. `mergeData` works like a nested `Object.assign` in that the util has
a variadic argument length&mdash;you can pass any number of arguments to it, and they will all be merged from left to
right (the right most arguments taking merge priority). You don't have to pass a new target object as the first
argument, as the return value will always be a fresh object.

## Additional Info

This util was written with performance in mind. Since functional components are perfect for components that are
stateless and have many nodes rendered, the `mergeData` util is expected to be called extensively. As such, minimal
variable allocations are made as well as minimal internal function calls _(for loops are preferred over `map`, `reduce`,
& `forEach` to avoid adding stack frames)_. TypeScript is used with Vue typings to ensure the most accurate merge
strategy for each property of the `context.data` object. You can run the benchmark yourself, but simple merges run at
~1,000,000 ops/sec and complex merges at ~400,000 ops/sec.
