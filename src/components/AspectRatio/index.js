import React from "react";
import styled from "styled-components";

const Outer = styled.div`
  height: 0;
  overflow: hidden;
  padding-top: ${(p) => `${(1 / p.ratio) * 100}%`};
  position: relative;
`;

const Inner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

/**
 * A component that maintains a given aspect ratio for its children.
 * @param {number} [ratio=1] - The aspect ratio to maintain.
 * @param {ReactNode} children - The child elements to render.
 * @param {Object} props - Additional props to pass to the component.
 * @returns The component with the given aspect ratio and children.
 */
const AspectRatio = ({ ratio = 1, children, ...props }) => (
  <Outer ratio={ratio} {...props}>
    <Inner>{children}</Inner>
  </Outer>
);

export default AspectRatio;
