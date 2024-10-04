import * as React from "react";

const LoggedIn = ({
  size = 34,
  filled = false,
  color = "currentColor",
  strokeWidth = "1.5",
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ display: "block", ...style }}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 19C3.69137 16.6928 5.46998 16 9.5 16C13.53 16 15.3086 16.6928 16 19"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M13 9.5C13 11.433 11.433 13 9.5 13C7.567 13 6 11.433 6 9.5C6 7.567 7.567 6 9.5 6C11.433 6 13 7.567 13 9.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <path
      d="M15 5L16.5 6.5V6.5C16.7761 6.77614 17.2239 6.77614 17.5 6.5V6.5L21 3"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LoggedIn;
