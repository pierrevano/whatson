import React from "react";
import { colors } from "../../theme";

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
    stroke={colors.white}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    style={{ display: "block", ...style }}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M5 12L5 4" />
    <path d="M19 20L19 17" />
    <path d="M5 20L5 16" />
    <path d="M19 13L19 4" />
    <path d="M12 7L12 4" />
    <path d="M12 20L12 11" />
    <circle cx={5} cy={14} r={2} />
    <circle cx={12} cy={9} r={2} />
    <circle cx={19} cy={15} r={2} />
  </svg>
);

export default Filter;
