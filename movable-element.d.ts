type PossibleToValues = "start" | "end" | "before" | "after" | "replace" | "swap";
type PossibleActionValues = PossibleToValues | "in";
type PossiblePositionValues = "after" | "before";

type MovableElementInitAttributes = {
  /** **ID** of the target element without `#`. Adds the `target` attribute to the element. Required if the element **does not** have the `target` attribute and the `manual` property is set to `false` */
  targetID?: string;

  /** In which media query the element will be moved. Adds the `media` attribute to the element. If the element does not have the `media` attribute, the default value is `(max-width: 768px)` */
  media?: string;

  /** Where the element will move relative to the target element. Adds the `to` attribute to the element. If the element does not have the `to` attribute, the default value is `end` */
  to?: PossibleToValues;

  /** If set to `false`, the `manual` attribute will be removed and the movement will occur automatically. The default value is `true` */
  manual?: boolean;
};

declare class MovableElement extends HTMLElement {
  constructor();

  private __start__(): void;
  private __end__(): void;
  private __before__(): void;
  private __after__(): void;
  private __replace__(): void;
  private __swap__(): void;
  private __in__(): void;

  /**
   * Initializes the element. If the element **has** the `target` attribute and the target element **is found**, initialization occurs **automatically**
   *
   * If the element **has** the `manual` attribute, the element **will not** move **automatically**. To move the element, you need to manually control the movement using the `move`, `return`, or `toggle` methods, or call the `reinit` method with the parameter `{ manual: false }`
   */
  init(attributes?: MovableElementInitAttributes): void;

  /** Completely deinitializes the element */
  destroy(): void;

  /** Reinitializes the element */
  reinit(attributes?: MovableElementInitAttributes): void;

  /** Method for manually moving the element to the position specified in the `to` attribute relative to the target element */
  move(): void;

  /** Method for manually returning the element to its original place in the DOM */
  return(): void;

  /** Method for manually toggling between moving and returning. If the element is moved, it will be returned and vice versa */
  toggle(): void;
}

declare interface MovableElementEvent extends CustomEvent {
  detail: {
    element: MovableElement;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "movable-element": MovableElement;
  }

  interface HTMLElementEventMap {
    "before-movable-element-move": MovableElementEvent;
    "after-movable-element-move": MovableElementEvent;
    "before-movable-element-return": MovableElementEvent;
    "after-movable-element-return": MovableElementEvent;
  }
}

export {
  MovableElement,
  PossibleToValues,
  PossibleActionValues,
  PossiblePositionValues,
  MovableElementInitAttributes
}
