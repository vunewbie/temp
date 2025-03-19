import React from "react";
import "./ScrollToTop.css";

function ScrollToTop() {
  const scrollToTop = () => {        
    document.body.scrollTop = 0;
  };

  return (
    <div className="scroll-to-top-container">
      <button
        className="scroll-to-top"
        onClick={scrollToTop}
        aria-label="Cuộn lên đầu trang"
      >
        ▲
      </button>
    </div>
  );
}

export default ScrollToTop;
