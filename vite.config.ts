import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const PATH = process.env.APP_URL || "https://cosmoleen.com";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": PATH,
      "/is_cover_image": `${PATH}/storage/uploads/`,
      "/product_image": `${PATH}/storage/uploads/`,
    },
  },
});
