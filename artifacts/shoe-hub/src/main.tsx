import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set initial theme on body
document.body.dataset.theme = "white";

createRoot(document.getElementById("root")!).render(<App />);
