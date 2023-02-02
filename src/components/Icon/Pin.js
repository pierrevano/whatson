import React from "react";

const Pin = ({ size = 23, filled = false, color = "currentColor", strokeWidth = "2", style, ...props }) => (
  <svg className="pinIcon" viewBox="0 0 25 25" strokeLinecap="square" strokeLinejoin="square" width={size} height={size} style={{ display: "block", ...style }} xmlns="http://www.w3.org/2000/svg" {...props}>
    <g>
      <path strokeWidth={0.3} stroke={color} fill={color} d="M12,24l-0.7-0.6C11,23.1,3,16.5,3,9c0-5,4-9,9-9s9,4,9,9c0,7.5-8,14.1-8.3,14.4L12,24z M12,2C8.1,2,5,5.1,5,9 c0,5.4,5.1,10.5,7,12.3c1.9-1.8,7-6.9,7-12.3C19,5.1,15.8,2,12,2z M12,13c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S14.2,13,12,13z M12,7c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,7,12,7z" />
    </g>
  </svg>
);

export default Pin;
