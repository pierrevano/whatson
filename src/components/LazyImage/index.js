import React, { useEffect, useState } from "react";

const LazyImage = ({ children, placeholder, src }) => {
  const [currentSrc, setCurrentSrc] = useState(placeholder || src);
  const [loading, setLoading] = useState(
    Boolean(src && placeholder && placeholder !== src),
  );

  useEffect(() => {
    const fallbackSrc = placeholder || src;

    setCurrentSrc(fallbackSrc);

    if (
      !src ||
      src === fallbackSrc ||
      typeof window === "undefined" ||
      typeof window.Image === "undefined"
    ) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    setLoading(true);

    const image = new window.Image();
    const finalize = () => {
      if (!active) return;
      setCurrentSrc(src);
      setLoading(false);
    };

    image.onload = finalize;
    image.onerror = finalize;
    image.src = src;

    return () => {
      active = false;
      image.onload = null;
      image.onerror = null;
    };
  }, [placeholder, src]);

  return children(currentSrc, loading);
};

export default LazyImage;
