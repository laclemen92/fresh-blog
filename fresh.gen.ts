// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_images from "./routes/api/images.ts";
import * as $api_notes from "./routes/api/notes.ts";
import * as $api_posts from "./routes/api/posts.ts";
import * as $api_users from "./routes/api/users.ts";
import * as $api_votes from "./routes/api/votes.ts";
import * as $index from "./routes/index.tsx";
import * as $notes_id_ from "./routes/notes/[id].tsx";
import * as $notes_edit_id_ from "./routes/notes/edit/[id].tsx";
import * as $notes_index from "./routes/notes/index.tsx";
import * as $notes_new from "./routes/notes/new.tsx";
import * as $posts_slug_ from "./routes/posts/[slug].tsx";
import * as $posts_edit_slug_ from "./routes/posts/edit/[slug].tsx";
import * as $posts_favorites from "./routes/posts/favorites.tsx";
import * as $posts_index from "./routes/posts/index.tsx";
import * as $posts_new from "./routes/posts/new.tsx";
import * as $user_userLogin_posts from "./routes/user/[userLogin]/posts.tsx";
import * as $Button from "./islands/Button.tsx";
import * as $DeleteNote from "./islands/DeleteNote.tsx";
import * as $DeletePostButton from "./islands/DeletePostButton.tsx";
import * as $Editor from "./islands/Editor.tsx";
import * as $EncryptionSecretPrompt from "./islands/EncryptionSecretPrompt.tsx";
import * as $VoteButton from "./islands/VoteButton.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/images.ts": $api_images,
    "./routes/api/notes.ts": $api_notes,
    "./routes/api/posts.ts": $api_posts,
    "./routes/api/users.ts": $api_users,
    "./routes/api/votes.ts": $api_votes,
    "./routes/index.tsx": $index,
    "./routes/notes/[id].tsx": $notes_id_,
    "./routes/notes/edit/[id].tsx": $notes_edit_id_,
    "./routes/notes/index.tsx": $notes_index,
    "./routes/notes/new.tsx": $notes_new,
    "./routes/posts/[slug].tsx": $posts_slug_,
    "./routes/posts/edit/[slug].tsx": $posts_edit_slug_,
    "./routes/posts/favorites.tsx": $posts_favorites,
    "./routes/posts/index.tsx": $posts_index,
    "./routes/posts/new.tsx": $posts_new,
    "./routes/user/[userLogin]/posts.tsx": $user_userLogin_posts,
  },
  islands: {
    "./islands/Button.tsx": $Button,
    "./islands/DeleteNote.tsx": $DeleteNote,
    "./islands/DeletePostButton.tsx": $DeletePostButton,
    "./islands/Editor.tsx": $Editor,
    "./islands/EncryptionSecretPrompt.tsx": $EncryptionSecretPrompt,
    "./islands/VoteButton.tsx": $VoteButton,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
