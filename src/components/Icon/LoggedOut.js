import * as React from "react";

const LoggedOut = ({
  size = 30,
  filled = false,
  color = "currentColor",
  strokeWidth = "1.5",
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    className="logged-out-icon"
    viewBox="0 0 24 24"
    fill="none"
    style={{ display: "block", ...style }}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <path
      d="M15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <path
      d="M6 19C6.63819 16.6928 8.27998 16 12 16C15.72 16 17.3618 16.6425 18 18.9497"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

export default LoggedOut;
