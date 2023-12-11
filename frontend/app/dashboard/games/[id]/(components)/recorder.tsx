import { HTMLAttributes, useEffect, useRef, useState } from "react";

interface KeyRecorderProps extends HTMLAttributes<HTMLDivElement> {
  handleKeyDown?: (code: string) => void;
  handleKeyUp?: (code: string) => void;
  aspectRatio: number;
  controls?: React.ReactNode;
}

export function KeyRecorder({
  handleKeyUp,
  handleKeyDown,
  aspectRatio,
  controls,
  ...props
}: KeyRecorderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const div = ref.current;
    if (!div) return;
    const onKeyDown = (e: KeyboardEvent) => {
      handleKeyDown?.(e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      handleKeyUp?.(e.code);
    };

    div.addEventListener("keydown", onKeyDown);
    div.addEventListener("keyup", onKeyUp);

    return () => {
      div.removeEventListener("keydown", onKeyDown);
      div.removeEventListener("keyup", onKeyUp);
    };
  }, [handleKeyUp, handleKeyDown]);

  useEffect(() => {
    if (!ref.current) return;
    const width = ref.current.parentElement?.clientWidth ?? 0;
    setWidth(width);
    const onWidthChange = () => {
      const width = ref.current?.parentElement?.clientWidth ?? 0;
      setWidth(width);
    };

    window.addEventListener("resize", onWidthChange);
    return () => {
      window.removeEventListener("resize", onWidthChange);
    };
  }, [ref]);

  return (
    <div ref={ref}>
      {controls}
      <div
        style={{
          width,
          height: width * aspectRatio,
        }}
        {...props}
        tabIndex={0}
      />
    </div>
  );
}
