# `<movable-element>`

[![Socket Badge](https://socket.dev/api/badge/npm/package/movablement/2.0.0)](https://socket.dev/npm/package/movablement/overview/2.0.0)

`<movable-element>` is a custom **HTML** element that allows you to automatically or manually move an element in the **DOM** relative to another element (target) based on specified attributes. The element can be moved to various positions relative to the target element, such as `start`, `end`, `before`, `after`, `replace`, and `swap`. Automatic movement occurs only under certain media query conditions (e.g., when the screen size changes).

## Installation

To use `<movable-element>` in your project, you can install it using one of the following package managers:

**npm**
```bash
npm install movablement
```

**yarn**
```bash
yarn add movablement
```

**pnpm**
```bash
pnpm add movablement
```

After installation, import the element into your project:

```javascript
import "movablement";
```

## Attributes

- `target`: **ID** of the target element without the `#` prefix, relative to which the current element will be moved. Required attribute if the `manual` attribute is not specified.
- `to`: The position to which the element will be moved relative to the target element. Possible values:
  - `start` — move the element to the beginning of the target element.
  - `end` — move the element to the end of the target element. **Default value**.
  - `before` — move the element before the target element.
  - `after` — move the element after the target element.
  - `replace` — replace the target element with the current element.
  - `swap` — swap the current element and the target element.
  - an integer value — move the element to a specific position among the child elements of the target element. `0` — first child element, `-1` — last child element, etc.
- `media`: The media query under which the element will be moved. By default, `(max-width: 768px)` is used.
- `manual`: If set, the element will not move automatically. Movement will occur only when the `move()`, `return()`, or `toggle()` methods are called.


## Properties

- `isMoved`: A getter that returns `true` if the element is moved and `false` if the element is not moved.

## Methods

- `init(attributes?)`: Initializes the element with the specified attributes. If the element already has a `target` attribute and the target element is found, initialization occurs automatically.
- `destroy(isReturn?)`: Completely deinitializes the element.
- `reinit(attributes?, isReturn?)`: Reinitializes the element with new attributes.
- `move()`: Manually moves the element to the position specified in the `to` attribute.
- `return()`: Manually returns the element to its original place in the **DOM**.
- `toggle()`: Toggles between moving and returning the element.


## Parameters

### `isReturn` in the `destroy()` and `reinit()` methods

If `isReturn` is set to `true`, the element will be returned to its original place in the **DOM**.


### `attributes` in the `init()` and `reinit()` methods

- `targetID` (optional): A string containing the **ID** of the target element without the `#` prefix, relative to which the current element will be moved. If the element already has a `target` attribute, this parameter will overwrite it.
- `media` (optional): A string containing the media query under which the element will be moved. If the element already has a `media` attribute, this parameter will overwrite it. By default, `(max-width: 768px)` is used.
- `to` (optional): A string defining the position to which the element will be moved relative to the target element. Possible values: `start`, `end`, `before`, `after`, `replace`, `swap`, or a numeric value to specify the position among the child elements of the target element. If the element already has a `to` attribute, this parameter will overwrite it. By default, `end` is used.
- `manual` (optional): A boolean value (`true` or `false`) that determines whether the element will move automatically or manually. If set to `true`, the element will not move automatically, and the `move()`, `return()`, or `toggle()` methods will need to be called to move it. If the element already has a `manual` attribute, this parameter will overwrite it. By default, `true` is used.

> :information_source:
>
> When to use the `init()` or `reinit()` method?
> - Element initialization: When first using the element, if you want to set attributes programmatically rather than through **HTML**.
> - Changing settings: If you need to change the element's attributes dynamically (e.g., in response to user actions or changes in the application).
> - Manual control: If you want to temporarily disable automatic movement and control the element manually.

## Events

- `before-movable-element-move`: Fires before the element is moved.
- `after-movable-element-move`: Fires after the element is moved.
- `before-movable-element-return`: Fires before the element is returned.
- `after-movable-element-return`: Fires after the element is returned.

## Usage Examples

**You can see live examples of using `<movable-element>` on [CodePen](https://codepen.io/collection/PooLNJ).**

### Example 1: Automatic element movement

```html
<div id="target">
  <p>Target element content</p>
</div>

<movable-element target="target" to="start">
  Movable element
</movable-element>
```

In this example, the `<movable-element>` will automatically move to the beginning of the element with the **ID** `target` when the screen width is less than or equal to **768px**.

### Example 2: Manual movement control

**HTML**
```html
<div class="buttons">
  <button class="buttons__move">Move</button>
  <button class="buttons__return">Return</button>
  <button class="buttons__toggle">Toggle</button>
</div>

<div id="target">
  <p>Target element content</p>
</div>

<movable-element target="target" to="after" manual>
  Movable element
</movable-element>
```

**JavaScript**
```javascript
const movableElement = document.querySelector("movable-element");

const moveButton = document.querySelector(".buttons__move");
const returnButton = document.querySelector(".buttons__return");
const toggleButton = document.querySelector(".buttons__toggle");

moveButton.addEventListener("click", () => {
  movableElement.move();
});

returnButton.addEventListener("click", () => {
  movableElement.return();
});

toggleButton.addEventListener("click", () => {
  movableElement.toggle();
});
```

In this example, the `<movable-element>` will be moved after the element with the **ID** `target` only when the **"Move"** button is clicked. The **"Return"** button will return the element to its original place, and the **"Toggle"** button will switch between moving and returning the element.

### Example 3: Using the `init()` and `reinit()` methods

**HTML**
```html
<div id="target-element-1">
  <p>First target element content</p>
</div>

<div id="target-element-2">
  <p>Second target element content</p>
</div>

<movable-element manual>
  Movable element
</movable-element>
```

**JavaScript**
```javascript
const movableElement = document.querySelector("movable-element");

// Initialize the element with parameters
movableElement.init({
  targetID: "target-element-1",
  media: "(min-width: 1024px)",
  to: "start",
  manual: false
});

// Reinitialize with new parameters
movableElement.reinit({
  targetID: "target-element-2",
  to: -1,
  manual: true
});
```

### Example 4: Using events

```javascript
const movableElement = document.querySelector("movable-element");

movableElement.addEventListener("before-movable-element-move", (event) => {
  console.log("Element will be moved", event.detail.element);
});

movableElement.addEventListener("after-movable-element-move", (event) => {
  console.log("Element was moved", event.detail.element);
});
```

## License

This project is licensed under the **MIT** License. See the *[LICENSE](LICENSE)* file for details.
