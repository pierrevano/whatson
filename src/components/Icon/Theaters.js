import React from "react";

const Theaters = ({ size = 20, filled = false, color = "currentColor", strokeWidth = "2", style, ...props }) => (
  <svg viewBox="0 0 24 24" strokeLinecap="square" strokeLinejoin="square" width={size} height={size} style={{ display: "block", ...style }} xmlns="http://www.w3.org/2000/svg" {...props}>
    <g>
      <path strokeWidth={strokeWidth} stroke={color} fill={color} d="M12,1C7.58,1,4,4.58,4,9c0,7.08,8,14,8,14s8-6.92,8-14C20,4.58,16.42,1,12,1z M12,12c-1.66,0-3-1.34-3-3s1.34-3,3-3 s3,1.34,3,3S13.66,12,12,12z" />
    </g>
  </svg>
);

export default Theaters;
