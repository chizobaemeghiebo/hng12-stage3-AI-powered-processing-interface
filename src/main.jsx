import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const originMeta1 = document.createElement("meta");
const originMeta2 = document.createElement("meta");
const originMeta3 = document.createElement("meta");
originMeta1.httpEquiv = "origin-trial";
originMeta1.content = import.meta.env.VITE_SUMMARIZER_API_KEY;
originMeta2.httpEquiv = "origin-trial";
originMeta2.content = import.meta.env.VITE_DETECTOR_API_KEY;
originMeta3.httpEquiv = "origin-trial";
originMeta3.content = import.meta.env.VITE_TRANSLATOR_API_KEY;

document.head.append(originMeta1);
document.head.append(originMeta2);
document.head.append(originMeta3);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
