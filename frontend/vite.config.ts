import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync("C:/certificates/localhost-key.pem"),
      cert: fs.readFileSync("C:/certificates/localhost.pem"),
    },
    host: "localhost",
    port: 5173,
  },
});
