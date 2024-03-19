import preact from "preact";

export interface ButtonProps {
  type: "button" | "anchor" | "avatar";
  href?: string;
  style?: "primary" | "secondary";
  //   text: string;
  children: preact.JSX.Element | string;
  onClick?: (e: Event) => Promise<void> | void;
  htmlClass?: string;
  tooltip?: boolean;
  tooltipContent?: string;
  tooltipId?: string;
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
  };

  const htmlClass = props.htmlClass || "";

  if (props.type === "anchor" && props.href && props.style) {
    return (
      <a
        href={props.href}
        class={`rounded-lg ${
          styles[props.style].background
        } px-3 py-2 text-sm font-semibold ${
          styles[props.style].text
        } shadow-sm ring-1 ring-inset ${styles[props.style].ring} ${
          styles[props.style].hover
        } ${props.htmlClass || ""}`}
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
        >
          {props.children}
        </button>
        {props.tooltip && (
          <div
            id={props.tooltipId || "tooltip"}
            role="tooltip"
            class="absolute z-10 invisible bottom-1 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
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
      >
        {props.children}
      </button>
    );
  } else {
    return null;
  }
}
