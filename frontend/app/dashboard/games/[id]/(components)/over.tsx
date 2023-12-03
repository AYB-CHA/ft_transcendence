import React, { useEffect, useState } from "react";

export function GameOver() {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const to = setTimeout(() => {
      setHide(true);
    }, 1000);

    return () => {
      clearTimeout(to);
    };
  }, []);

  if (hide) return null;
  return (
    <div>
      <h1 className="text-5xl animate-out fade-out-0">Game Over</h1>
    </div>
  );
}
