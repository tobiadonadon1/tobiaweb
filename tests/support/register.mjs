// Loaded with `node --import ./tests/support/register.mjs`. See hooks.mjs.
import { registerHooks } from "node:module";
import { resolve } from "./hooks.mjs";

registerHooks({ resolve });
