/** @format */

import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env": env,
    },
    plugins: [react()],
    // build: {
    // Set base URL to include '/tokenomics/assets/'
    base: "/tokenomics/",
    // },
  };
});
