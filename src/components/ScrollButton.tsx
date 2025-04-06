import React, { useState, useEffect } from "react";

const ScrollButton = () => {
  const [isInUpperHalf, setIsInUpperHalf] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const thresholdPoint = documentHeight * 0.8;

      const currentViewPosition = scrollPosition + viewportHeight / 2;

      setIsInUpperHalf(currentViewPosition < thresholdPoint);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Scroll function
  const handleClick = () => {
    if (isInUpperHalf) {
      // In upper half, scroll down to the bottom
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-12 left-16 z-50 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-900 transition-colors duration-300"
      aria-label={isInUpperHalf ? "Scroll to bottom" : "Scroll to top"}
    >
      {isInUpperHalf ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      )}
    </button>
  );
};

export default ScrollButton;
