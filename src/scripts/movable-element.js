/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2025 Javid Gulmaliyev
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/** @typedef {import("../types/movable-element.d.ts").PossibleToValues} PossibleToValues */
/** @typedef {import("../types/movable-element.d.ts").PossibleActionValues} PossibleActionValues */
/** @typedef {import("../types/movable-element.d.ts").PossiblePositionValues} PossiblePositionValues  */
/** @typedef {import("../types/movable-element.d.ts").MovableElementInitAttributes} MovableElementInitAttributes */
/** @typedef {import("../types/movable-element.d.ts").getTargetChild} getTargetChild */
/** @typedef {import("../types/movable-element.d.ts").reinit} reinit */

class MovableElement extends HTMLElement {
  /** @type {PossibleToValues[]} */
  static #possibleToValues = ["start", "end", "before", "after", "replace", "swap"];

  /** @type {boolean} */
  #isManual;
  /** @type {HTMLElement} */
  #target;
  /** @type {MediaQueryList} */
  #breakpoint;
  /** @type {PossibleToValues} */
  #to;
  /** @type {number} */
  #index;
  /** @type {boolean} */
  #isInit;
  /** @type {PossibleActionValues} */
  #action;
  /** @type {PossiblePositionValues} */
  #position;
  /** @type {AbortController} */
  #abortController;
  /** @type {boolean} */
  #isMoved;

  #placeholder = document.createComment(" <movable-element-placeholder> ");

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.#isInit) {
      this.#preparation();
    }

    if (this.#target && !this.#isManual) {
      this.#init();
    }
  }

  disconnectedCallback() {
    this.#destroy();
  }

  #preparation() {
    this.#setProperties();

    if (this.#target) {
      this.#differenceCheck();
      this.#setAction();
    }
  }

  #setProperties() {
    const targetID = this.getAttribute("target")?.trim();
    const mediaQuery = this.getAttribute("media")?.trim() ?? "(max-width: 768px)";

    this.#isManual = this.hasAttribute("manual");

    if (!targetID) {
      if (!this.#isManual) {
        throw new Error("target attribute is required.");
      }

      return;
    }

    this.#target = document.getElementById(targetID);

    if (!this.#target) {
      return;
    }

    this.#breakpoint = matchMedia(mediaQuery);
    this.#to = this.getAttribute("to")?.trim() ?? "end";

    if (!MovableElement.#possibleToValues.includes(this.#to) && !this.#to.match(/^\-?\d+$/)) {
      throw new Error(`attribute to can be a integer or ${MovableElement.#possibleToValues.join(", ")}.`);
    }

    this.#isInit = true;
  }

  #differenceCheck() {
    let isSame = this.#target === this;

    this.#index = Number(this.#to);

    if (!isSame) {
      switch (this.#to) {
        case "start":
        case "0":

          isSame = this.#getTargetChild(0) === this;

          break;

        case "end":
        case "-1":

          isSame = this.#getTargetChild(-1) === this;

          break;

        case "before":

          isSame = this.#target.previousElementSibling === this;

          break;

        case "after":

          isSame = this.#target.nextElementSibling === this;

          break;

        default:

          isSame = this.#getTargetChild(this.#index) === this;

          break;
      }
    }

    if (isSame) {
      throw new Error("The element cannot be moved to the same position.");
    }
  }

  #setAction() {
    const isNegativeIndex = this.#index < 0;

    if (MovableElement.#possibleToValues.includes(this.#to)) {
      this.#action = this.#to;

      return;
    }

    if (!this.#getTargetChild(this.#index)) {
      this.#action = isNegativeIndex ? "start" : "end";

      return;
    }

    this.#action = "in";
    this.#position = isNegativeIndex ? "after" : "before";
  }

  /** @type {getTargetChild} */
  #getTargetChild(index) {
    const targetChildren = [...this.#target.children].filter(
      /** @param {HTMLElement} child */
      child => {
        if (child instanceof MovableElement && child.isMoved) {
          return;
        }

        return child;
      });

    return targetChildren.at(index);
  }

  #init() {
    this.#abortController = new AbortController();

    this.#toggle(this.#breakpoint);

    this.#breakpoint.addEventListener("change", this.#toggle.bind(this), { signal: this.#abortController.signal });
  }

  #destroy() {
    this.#abortController?.abort();

    this.#abortController = null;
  }

  /** @param {MediaQueryList | MediaQueryListEvent} mediaQuery */
  #toggle(mediaQuery) {
    const { matches } = mediaQuery;

    matches ? this.move() : this.return();
  }

  #addPlaceholder() {
    this.replaceWith(this.#placeholder);
  }

  /** @param {string} type */
  #dispatchCustomEvent(type) {
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      detail: {
        element: this,
      },
    }));
  }

  __start__() {
    this.#target.prepend(this);
  }

  __end__() {
    this.#target.append(this);
  }

  __before__() {
    this.#target.before(this);
  }

  __after__() {
    this.#target.after(this);
  }

  __replace__() {
    this.#target.replaceWith(this);
  }

  __swap__() {
    this.#target.replaceWith(this);
    this.#placeholder.replaceWith(this.#target);
  }

  __in__() {
    this.#getTargetChild(this.#index)[this.#position](this);
  }

  /** @param { MovableElementInitAttributes } attributes */
  init(attributes = {}) {
    if (!this.#isInit) {
      const { targetID, media, manual = true, to } = attributes;

      if (targetID) this.setAttribute("target", targetID);
      if (media) this.setAttribute("media", media);
      if (to) this.setAttribute("to", to);

      this.toggleAttribute("manual", manual);

      this.#preparation();

      if (!this.#isManual) {
        this.#init();
      }
    }
  }

  /** @param {boolean} isReturn */
  destroy(isReturn) {
    if (this.#isInit) {
      this.#destroy();

      if (isReturn) {
        this.#isManual = true;

        this.return();
      }

      this.#isManual = null;
      this.#target = null;
      this.#breakpoint = null;
      this.#to = null;
      this.#index = null;
      this.#isInit = null;
      this.#action = null;
      this.#position = null;
      this.#isMoved = null;

      this.#placeholder.remove();
    }
  }

  /** @type {reinit} */
  reinit(attributes = {}, isReturn) {
    this.destroy(isReturn);
    this.init(attributes);
  }

  move() {
    if (!this.#isMoved) {
      this.#dispatchCustomEvent("before-movable-element-move");

      this.#isMoved = true;

      this.#addPlaceholder();

      this[`__${this.#action}__`]();

      this.#dispatchCustomEvent("after-movable-element-move");
    }
  }

  return() {
    if (this.#isMoved) {
      this.#dispatchCustomEvent("before-movable-element-return");

      this.#isMoved = false;

      if (this.#to === "replace") {
        this.replaceWith(this.#target);
      }

      if (this.#to === "swap") {
        this.#addPlaceholder();

        this.#target.replaceWith(this);
        this.#placeholder.replaceWith(this.#target);

        return;
      }

      this.#placeholder.replaceWith(this);

      this.#dispatchCustomEvent("after-movable-element-return");
    }
  }

  toggle() {
    this.#isMoved ? this.return() : this.move();
  }

  get isMoved() {
    return this.#isMoved;
  }
}

customElements.define("movable-element", MovableElement);

export { MovableElement };
