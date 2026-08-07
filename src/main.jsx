import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes.jsx";
import "./index.css";
import "./design/organic.css";

// vite-react-ssg entry: statically renders every route in `routes` at build time
// and hydrates on the client.
export const createRoot = ViteReactSSG({ routes });
