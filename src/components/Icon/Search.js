import React from "react";

const Search = ({ size = 24, filled = false, color = "currentColor", strokeWidth = "2", style, ...props }) => (
  <svg viewBox="0 0 24 24" strokeLinecap="square" strokeLinejoin="square" width={size} height={size} style={{ display: "block", ...style }} xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(0.000000,24.000000) scale(0.064,-0.064)">
      <path strokeWidth={strokeWidth} stroke={color} fill={color} d="M72 300 c-40 -25 -72 -75 -72 -115 0 -101 117 -177 200 -130 23 13 27 11 62 -23 30 -28 41 -33 50 -24 9 9 4 20 -24 50 -34 35 -36 39 -23 62 35 61 4 148 -65 182 -46 23 -87 23 -128 -2z m117 -34 c47 -25 63 -83 37 -135 -35 -66 -137 -66 -172 0 -47 91 44 182 135 135z" />
    </g>
  </svg>
);

export default Search;
