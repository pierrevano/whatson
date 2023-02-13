import React from "react";

const CheckMark = ({ size = 16, filled = false, color = "currentColor", style, ...props }) => (
  <svg viewBox="0 0 24 24" width={size * 2} height={size * 1.75} {...props}>
    <path fill="#FFF" d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,8.71-5,5a1,1,0,0,1-1.42,0l-3-3a1,1,0,1,1,1.42-1.42L11,13.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z" />
  </svg>
);

export default CheckMark;
