# vue-functional-data-merge
Vue.js util for intelligently merging data passed to functional components. (~500b gzipped)

## Getting Started
Load the util from npm:
```sh
npm i vue-functional-data-merge
# or for yarn users
yarn add vue-functional-data-merge
```

Now import and use it in your functional component declaration:
```js
// MyFunctionalComponent.js
import mergeData from "vue-functional-data-merge" // default export, so rename as desired

export default {
    name: "my-functional-component",
    functional: true,
    props: ['foo','bar','baz'],
    render(h, { props, data, children }) {
        const componentData = mergeData(data, {
            staticClass: "fn-component", // concatenates all static classes
            class: { // object|Array|string all get merged and preserved
                active: props.foo,
                "special-class": props.bar
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
                }
            }
        })

        return h("div", componentData, children)
    }
}
```

## Use Case
When writing functional Vue components, the render function receives a `context.data` object ([see vue docs](https://vuejs.org/v2/guide/render-function.html#Functional-Components)). This object that contains the entire data object passed to the component (the shape of which [can be found here](https://vuejs.org/v2/guide/render-function.html#The-Data-Object-In-Depth)). In order to write flexible components, the data object used to create the component must be merged with the data received. If not, only the properties defined by the component will be rendered.
