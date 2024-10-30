import { Plugin } from "$fresh/server.ts";
import { PluginRenderContext } from "$fresh/src/server/types.ts";

export function FlowbitePlugin(): Plugin {
  return {
    name: "flowbite",
    entrypoints: { "main": import.meta.resolve("./flowbite.plugin.ts") },
    render(ctx: PluginRenderContext) {
      ctx.render();
      return {
        scripts: [
          {
            entrypoint: "main",
            state: {},
          },
        ],
      };
    },
  };
}
