import React from "react";
import styled from "styled-components";
import Text from "components/Text";

const Wrapper = styled.div`
  display: inline-flex;
  color: currentColor;
  text-decoration: none;
  border-radius: 0.25rem;
  box-shadow: inset 0 0 0 1px ${(p) => p.theme.colors.midGrey};
  overflow: hidden;
  margin: 1rem 0.5rem;
  @media (max-width: 980px) {
    margin: 1rem 0.5rem 0 0.5rem;
  }
  outline: none;
  &:focus {
    box-shadow: inset 0 0 0 0.125rem ${(p) => p.theme.colors.green};
  }
  cursor: pointer;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.background};
  padding: 0.5rem;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
`;

/**
 * A button component that displays a logo and text.
 * @param {string} logo - The logo to display on the left side of the button.
 * @param {string} background - The background color of the button.
 * @param {string} children - The text to display on the right side of the button.
 * @param {function} displayRatingsDetails - A function to call when the button is clicked.
 * @returns A button component with a logo and text.
 */
const Button = ({ logo, background, children, displayRatingsDetails }) => (
  <Wrapper onClick={displayRatingsDetails} tabIndex={0}>
    {logo && <Left background={background}>{logo}</Left>}
    {children && (
      <Right>
        <Text weight={500}>{children}</Text>
      </Right>
    )}
  </Wrapper>
);

export default Button;
