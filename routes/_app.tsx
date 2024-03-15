import { defineApp } from "$fresh/server.ts";
import type { State } from "@/plugins/session.ts";
import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";

export default defineApp<State>((_, ctx) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>fresh-blog</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div class="bg-white min-h-screen flex flex-col">
          <Header url={ctx.url} sessionUser={ctx.state?.sessionUser} />
          <div class="flex flex-row px-8 pt-8 pb-20 grow">
            <ctx.Component />
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
});
