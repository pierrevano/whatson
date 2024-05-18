import React from "react";
import styled from "styled-components";
import Link from "components/Link";

const linkStyle = `
  display: block;
  text-decoration: none;
  color: currentColor;
  margin: -0.75rem;
  padding: 0.75rem;
  border-radius: 2rem;
  user-select: none;
  cursor: pointer;
  margin-right: 0.5rem;
  &:last-child {
    margin-right: -0.75rem;
  }
`;

const StyledLink = styled(Link)`
  ${linkStyle}
  &:focus {
    ${(p) => p.theme.focusShadow}
  }
`;

const Button = styled.button`
  background: none;
  border: none;
  appearance: none;
  ${linkStyle}
  &:focus {
    ${(p) => p.theme.focusShadow}
  }
`;

/**
 * A functional component that renders a button or a link based on whether it is active or not.
 * @param {boolean} active - A boolean value indicating whether the component is active or not.
 * @param {string} to - The URL to link to if the component is not active.
 * @param {ReactNode} children - The child elements to render inside the component.
 * @returns A button or a link component based on the value of the active prop.
 */
const Item = ({ active, to, className, title, children }) => {
  if (active)
    return (
      <Button
        onClick={() => window.history.back()}
        style={{}}
        className={className}
        title={title}
      >
        {children}
      </Button>
    );
  return (
    <StyledLink to={to} tabIndex={0} className={className} title={title}>
      {children}
    </StyledLink>
  );
};

export default Item;
