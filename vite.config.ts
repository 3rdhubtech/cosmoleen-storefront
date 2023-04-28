import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as dotenv from "dotenv";
import tsconfigPaths from "vite-tsconfig-paths";

dotenv.config();
const PATH = process.env.APP_URL;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react()],

  server: {
    proxy: {
      "/api": PATH,
      "/is_cover_image": `${PATH}/storage/uploads/`,
      "/product_image": `${PATH}/storage/uploads/`,
      "/store_logo": `${PATH}/storage/uploads/`,
      "/logo": `${PATH}/storage/uploads/`,
    },
  },
});
