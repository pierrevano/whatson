import React from "react";

const UpRightArrow = ({
  size = 31,
  filled = false,
  color = "currentColor",
  style,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    stroke="#FFF"
    strokeWidth={0.1}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    style={{ display: "block", ...style }}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.45999 6.29999C8.26108 6.29999 8.07031 6.37901 7.92966 6.51966C7.78901 6.66031 7.70999 6.85108 7.70999 7.04999C7.70999 7.2489 7.78901 7.43967 7.92966 7.58032C8.07031 7.72097 8.26108 7.79999 8.45999 7.79999H15.14L6.51999 16.42C6.4463 16.4886 6.3872 16.5715 6.34621 16.6634C6.30522 16.7554 6.28317 16.8548 6.2814 16.9555C6.27962 17.0562 6.29815 17.1562 6.33587 17.2496C6.37359 17.343 6.42973 17.4278 6.50095 17.499C6.57217 17.5702 6.657 17.6264 6.75039 17.6641C6.84378 17.7018 6.94381 17.7204 7.04451 17.7186C7.14521 17.7168 7.24453 17.6948 7.33653 17.6538C7.42853 17.6128 7.51133 17.5537 7.57999 17.48L16.2 8.85999V15.54C16.2 15.7389 16.279 15.9297 16.4197 16.0703C16.5603 16.211 16.7511 16.29 16.95 16.29C17.1489 16.29 17.3397 16.211 17.4803 16.0703C17.621 15.9297 17.7 15.7389 17.7 15.54V7.04999C17.6995 6.95029 17.6791 6.85171 17.64 6.75999C17.5856 6.63213 17.4971 6.52164 17.3843 6.44054C17.2714 6.35944 17.1385 6.31083 17 6.29999H8.45999Z"
      fill="#FFF"
    />
  </svg>
);
export default UpRightArrow;
