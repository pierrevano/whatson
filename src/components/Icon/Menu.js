import React from "react";
import { colors } from "../../theme";

const Menu = ({
  size = 30,
  filled = false,
  color = "currentColor",
  strokeWidth = 0.1,
  style,
  ...props
}) => (
  <svg
    className="menu-icon"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    style={{ display: "block", ...style }}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      stroke={colors.white}
      strokeWidth={strokeWidth}
      fill={colors.white}
      d="M3 6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM3 18C3 17.4477 3.44772 17 4 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z"
    />
  </svg>
);

export default Menu;
