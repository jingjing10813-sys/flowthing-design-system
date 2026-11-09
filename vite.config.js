import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { figmaMcpBridge } from "./server/figma-mcp.mjs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), figmaMcpBridge()],
  base: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/`
    : "/IotDesignsystem/",
});
