import path from "path";
import { defineConfig, loadEnv, ConfigEnv, ProxyOptions } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }: ConfigEnv) => {
  
  const env = loadEnv(mode, process.cwd(), "");

  const proxy: Record<string, string | ProxyOptions> =
    env.NODE_ENV === "development"
      ? {
          "/auth": {
            target: "http://localhost:4000",
            changeOrigin: true,
          },
          "/pto": {
            target: "http://localhost:4000",
            changeOrigin: true,
          },
        }
      : {};

  return {
    plugins: [react()],
    server: {
      port: 8080,
      host: true,
      proxy
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    }
  };
});