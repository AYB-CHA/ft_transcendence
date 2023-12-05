import { useEffect, useState } from "react";

export const useWidth = () => {
  const [width, setWidth] = useState(
    "window" in globalThis ? window.innerWidth : 700,
  );
  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return width;
};
