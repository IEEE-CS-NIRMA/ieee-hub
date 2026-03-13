import React from "react";
import "./LogoLoader.css";

type LogoLoaderProps = {
  phase: "tracing" | "revealing";
};
const LogoLoader = ({ phase }: LogoLoaderProps) => {
  return (
    <div className={`logo-loader-container logo-loader-${phase}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="350"
        height="350"
        viewBox="0 0 192.756 192.756"
        className="logo-loader-svg"
      >
        <g fill="none" fillRule="evenodd" clipRule="evenodd" strokeWidth="2.5">
          {/* Main Logo Components */}

          {/* Circle Border - Outer */}
          <path
            className="logo-path circle-outer"
            pathLength={1}
            d="M129.863 68.83c0 15.951-12.934 28.883-28.885 28.883-15.953 0-28.885-12.932-28.885-28.883 0-15.953 12.932-28.886 28.885-28.886 15.952 0 28.885 12.932 28.885 28.886z"
          />

          {/* Circle Border - Inner */}
          <path
            className="logo-path circle-inner"
            pathLength={1}
            d="M100.979 42.833c-14.358 0-25.996 11.64-25.996 25.997 0 14.355 11.638 25.996 25.996 25.996 14.357 0 25.994-11.641 25.994-25.996 0-14.358-11.637-25.997-25.994-25.997z"
          />

          {/* Phi Symbol */}
          <path
            className="logo-path phi-symbol"
            pathLength={1}
            d="M112.809 56.868h-7.266l-.023-11.412h-4.354c-1.617 3.087-6.073 5.379-11.46 5.688l-.026.014v2.535h5.729v3.175h-6.402c-6.684 0-12.102 5.419-12.102 12.102 0 6.684 5.418 12.103 12.102 12.103h6.402v.578a5.94 5.94 0 0 1-5.94 5.941v2.534h22.071v-2.534a5.942 5.942 0 0 1-5.943-5.941v-.578h7.213c6.684 0 12.102-5.419 12.102-12.103-.002-6.683-5.42-12.102-12.103-12.102z"
          />

          {/* Phi Symbol Internal Left */}
          <path
            className="logo-path phi-left"
            pathLength={1}
            d="M86.755 68.969c0-4.797 3.868-8.687 8.653-8.731V77.7c-4.785-.044-8.653-3.933-8.653-8.731z"
          />

          {/* Phi Symbol Internal Right */}
          <path
            className="logo-path phi-right"
            pathLength={1}
            d="M105.623 77.705h-.035l-.037-17.47h.072a8.735 8.735 0 0 1 0 17.47z"
          />
        </g>
      </svg>
    </div>
  );
};

export default LogoLoader;
