import React from "react";

const Filter = ({
  size = 31,
  filled = false,
  color = "currentColor",
  style,
  ...props
}) => (
  <svg
    className="filter-icon"
    viewBox="0 -0.6 24 24"
    stroke="#FFF"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    style={{ display: "block", ...style }}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M5 12L5 4" stroke="#FFF" strokeLinecap="round" />
    <path d="M19 20L19 17" stroke="#FFF" strokeLinecap="round" />
    <path d="M5 20L5 16" stroke="#FFF" strokeLinecap="round" />
    <path d="M19 13L19 4" stroke="#FFF" strokeLinecap="round" />
    <path d="M12 7L12 4" stroke="#FFF" strokeLinecap="round" />
    <path d="M12 20L12 11" stroke="#FFF" strokeLinecap="round" />
    <circle cx={5} cy={14} r={2} stroke="#FFF" strokeLinecap="round" />
    <circle cx={12} cy={9} r={2} stroke="#FFF" strokeLinecap="round" />
    <circle cx={19} cy={15} r={2} stroke="#FFF" strokeLinecap="round" />
  </svg>
);

export default Filter;
