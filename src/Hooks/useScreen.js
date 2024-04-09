import { useState, useEffect } from "react";

const useScreen = () => {
  const [screenWidth, setScreenWidth] = useState(window.screen.availWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.screen.availWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenWidth;
};

export default useScreen;
