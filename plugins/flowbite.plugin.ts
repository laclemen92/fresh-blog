export default function main() {
  const source = "https://unpkg.com/flowbite@1.7.0/dist/flowbite.min.js";
  const script = document.createElement("script");
  script.src = source;
  document.head.appendChild(script);
}
