import { defineApp } from "$fresh/server.ts";
import type { State } from "@/plugins/session.ts";
import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
import { Banner } from "@/islands/Banner.tsx";

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
        <div class="bg-white h-full">
          <Header url={ctx.url} sessionUser={ctx.state?.sessionUser} />
          <Banner content="Welcome to the jungle" type="error" />
          <ctx.Component />
          <Footer />
        </div>
      </body>
    </html>
  );
});
