import React from "react";
import styled from "styled-components";
import Container from "components/Container";
import Link from "components/Link";
import { Github } from "components/Icon";

const Wrapper = styled.div`
  padding: 1.5rem 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const Anchor = styled(Link)`
  display: block;
  text-decoration: none;
  color: currentColor;
  margin: -0.5rem;
  padding: 0.5rem;
  border-radius: 0.125rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.lightGrey};
  &:hover,
  &:focus {
    color: ${(p) => p.theme.colors.white};
  }
  &:focus {
    ${(p) => p.theme.focusShadow}
  }
  & strong {
    font-weight: 500;
  }
`;

/**
 * A functional component that renders the footer of the page.
 * @returns {JSX.Element} - The JSX code that renders the footer.
 */
const Footer = () => (
  <Container>
    <Wrapper>
      <Anchor to="/about">about</Anchor>
      <Anchor to="https://github.com/pierrevano/whatson" style={{ padding: "0.375rem" }}>
        <Github />
      </Anchor>
      <Anchor to="https://pierrevano.github.io">pierreschelde</Anchor>
    </Wrapper>
  </Container>
);

export default Footer;
