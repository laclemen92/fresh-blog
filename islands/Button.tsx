import preact from "preact";

export interface ButtonProps {
  type: "button" | "anchor" | "avatar";
  href?: string;
  style?: "primary" | "secondary" | "danger";
  //   text: string;
  children: preact.JSX.Element | string;
  onClick?: (e: Event) => Promise<void> | void;
  htmlClass?: string;
  tooltip?: boolean;
  tooltipContent?: string;
  tooltipId?: string;
  dataDropdownToggle?: string;
  dataDropdownPlacement?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export function Button(props: ButtonProps) {
  const styles = {
    primary: {
      background: "bg-gray-900",
      text: "text-white",
      ring: "ring-gray-900",
      hover: "hover:bg-gray-700",
    },
    secondary: {
      background: "bg-white",
      text: "text-gray-900",
      ring: "ring-gray-300",
      hover: "hover:bg-gray-50",
    },
    danger: {
      background: "bg-red-700",
      text: "text-white",
      ring: "ring-red-700",
      hover: "hover:bg-red-500 hover:ring-red-500",
    },
  };

  const htmlClass = props.htmlClass || "";

  if (props.type === "anchor" && props.href) {
    const classes: string[] = [
      ...htmlClass.split(" "),
    ];

    if (props.style) {
      classes.push(styles[props.style].background);
      classes.push(styles[props.style].text);
      classes.push(styles[props.style].ring);
      classes.push(styles[props.style].hover);
      classes.push("rounded-lg");
      classes.push("px-3");
      classes.push("py-2");
      classes.push("text-sm");
      classes.push("font-semibold");
      classes.push("shadow-sm");
      classes.push("ring-1");
      classes.push("ring-inset");
    }

    return (
      <a
        href={props.href}
        class={`${classes.join(" ") || ""}`}
        disabled={props.disabled}
      >
        {props.children}
      </a>
    );
  } else if (props.type === "button") {
    const classes: string[] = [
      ...htmlClass.split(" "),
    ];

    if (props.style) {
      classes.push(styles[props.style].background);
      classes.push(styles[props.style].text);
      classes.push(styles[props.style].ring);
      classes.push(styles[props.style].hover);
    }

    return (
      <>
        <button
          class={`${classes.join(" ") || ""}`}
          onClick={props.onClick}
          data-dropdown-toggle={props.dataDropdownToggle || ""}
          data-dropdown-placement={props.dataDropdownPlacement || ""}
          disabled={props.disabled}
          aria-label={props.ariaLabel || ""}
        >
          {props.children}
        </button>
        {props.tooltip && (
          <div
            id={props.tooltipId || "tooltip"}
            role="tooltip"
            class="absolute z-10 invisible bottom-1 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
          >
            {props.tooltipContent}
            <div class="tooltip-arrow" data-popper-arrow></div>
          </div>
        )}
      </>
    );
  } else if (props.type === "avatar") {
    return (
      <button
        onClick={props.onClick}
        data-dropdown-toggle={props.dataDropdownToggle || ""}
        data-dropdown-placement={props.dataDropdownPlacement || ""}
        disabled={props.disabled}
        aria-label={props.ariaLabel || ""}
      >
        {props.children}
      </button>
    );
  } else {
    return null;
  }
}
