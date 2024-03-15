export interface ButtonProps {
  type: "button" | "anchor";
  href?: string;
  style: "primary" | "secondary";
  //   text: string;
  children: any;
  onClick?: (e: Event) => Promise<void>;
  htmlClass?: string;
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

  if (props.type === "anchor" && props.href) {
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
    return (
      <button
        class={`rounded-lg ${
          styles[props.style].background
        } px-3 py-2 text-sm font-semibold ${
          styles[props.style].text
        } shadow-sm ring-1 ring-inset ${styles[props.style].ring} ${
          styles[props.style].hover
        } ${props.htmlClass || ""}`}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    );
  } else {
    return null;
  }
}
