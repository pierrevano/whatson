import React from "react";

const Trash = ({ size = 23, filled = false, color = "currentColor", strokeWidth = "2", style, ...props }) => (
  <svg className="trash-icon" viewBox="0 0 15.8 15.8" strokeLinecap="square" strokeLinejoin="square" width={size} height={size} style={{ display: "block", ...style }} xmlns="http://www.w3.org/2000/svg" {...props}>
    <g>
      <path fill={"#FFF"} d="M10.86,13.27a.4.4,0,0,1-.39.33H5.53a.4.4,0,0,1-.39-.29L3.87,5H2.46l1.3,8.53A1.8,1.8,0,0,0,5.53,15h4.94a1.8,1.8,0,0,0,1.77-1.47L13.54,5H12.13ZM13.1,2.2H11A1.39,1.39,0,0,0,9.61,1H6.39A1.39,1.39,0,0,0,5,2.2H2.9a.9.9,0,0,0-.9.9V4H14V3.1A.9.9,0,0,0,13.1,2.2Z" />
    </g>
  </svg>
);

export default Trash;
