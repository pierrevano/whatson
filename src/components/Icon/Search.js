import React from "react";

const Search = ({
  size = 31,
  filled = false,
  color = "currentColor",
  strokeWidth = "1.6",
  style,
  ...props
}) => (
  <svg
    viewBox="0 0 24 22"
    strokeLinecap="square"
    strokeLinejoin="square"
    width={size}
    height={size}
    style={{ display: "block", ...style }}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g>
      <path
        strokeWidth={strokeWidth}
        stroke={color}
        fill={filled ? color : "none"}
        d="M14.5776 14.5419C15.5805 13.53 16.2 12.1373 16.2 10.6C16.2 7.50721 13.6928 5 10.6 5C7.50721 5 5 7.50721 5 10.6C5 13.6928 7.50721 16.2 10.6 16.2C12.1555 16.2 13.5628 15.5658 14.5776 14.5419ZM14.5776 14.5419L19 19"
      />
    </g>
  </svg>
);

export default Search;
