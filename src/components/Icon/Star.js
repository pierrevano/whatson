import React from "react";
import { colors } from "../../theme";

const Star = ({
  size = 16,
  filled = false,
  color = "currentColor",
  style,
  ...props
}) => (
  <svg
    viewBox={filled ? "-0.5 1.5 23 23" : "10 1 1 23"}
    stroke={colors.white}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size * 2.5}
    height={size * 1.5}
    style={{ display: "block", ...style }}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill={filled ? colors.white : "none"}
      d="M11.8722 18.7751L6.64222 21.5251C6.27222 21.7151 5.84222 21.4051 5.91222 20.9951L6.91222 15.1751C6.92222 15.0951 6.90222 15.0051 6.84222 14.9551L2.61222 10.8351C2.31222 10.5451 2.48222 10.0451 2.89222 9.98512L8.74222 9.13512C8.82222 9.12512 8.89222 9.07512 8.93222 8.99512L11.5522 3.69512C11.7322 3.32512 12.2622 3.32512 12.4522 3.69512L15.0722 8.99512C15.1122 9.06512 15.1822 9.12512 15.2622 9.13512L21.1122 9.98512C21.5222 10.0451 21.6822 10.5451 21.3922 10.8351L17.1622 14.9551C17.1022 15.0151 17.0722 15.0951 17.0922 15.1751L18.0922 20.9951C18.1622 21.4051 17.7322 21.7151 17.3622 21.5251L12.1322 18.7751C12.0422 18.7351 11.9522 18.7351 11.8722 18.7751Z"
    />
  </svg>
);

export default Star;
