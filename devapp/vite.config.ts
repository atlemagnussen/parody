import { defineConfig } from "vite"
import path from "path"

const projectRootDir = path.resolve(__dirname)
const publicPath = path.resolve(projectRootDir, "public")

// https://vitejs.dev/config/
export default defineConfig({
    logLevel: "info",
    root: "src",
    publicDir: publicPath
})
