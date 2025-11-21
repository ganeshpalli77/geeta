import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suppress React DevTools console message in production
if (import.meta.env.PROD) {
  const originalLog = console.log;
  console.log = (...args) => {
    if (args[0]?.includes?.('React DevTools')) return;
    originalLog.apply(console, args);
  };
}

createRoot(document.getElementById("root")!).render(<App />);