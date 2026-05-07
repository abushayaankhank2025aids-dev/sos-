import { useState, useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Splash } from "./components/Splash";
import logoImg from "../imports/unnamed.png";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "ARS — Alert Rescue System";
    
    // Update favicon
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = logoImg;
  }, []);

  if (loading) {
    return <Splash onComplete={() => setLoading(false)} />;
  }

  return <RouterProvider router={router} />;
}
