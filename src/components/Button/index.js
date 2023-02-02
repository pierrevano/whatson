import React from "react";
import styled from "styled-components";
import Text from "components/Text";

const Wrapper = styled.a`
  display: inline-flex;
  color: currentColor;
  text-decoration: none;
  border-radius: 0.25rem;
  box-shadow: inset 0 0 0 1px ${(p) => p.theme.colors.midGrey};
  overflow: hidden;
  margin: 1rem 0.5rem;
  outline: none;
  &:focus {
    box-shadow: inset 0 0 0 0.125rem ${(p) => p.theme.colors.green};
  }
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

const getAllocineLink = (allocine, kindURL) => {
  const baseURL = "https://www.allocine.fr";
  if (kindURL === "movies") return `${baseURL}/film/fichefilm_gen_cfilm=${allocine}.html`;
  if (kindURL === "tv") return `${baseURL}/series/ficheserie_gen_cserie=${allocine}.html`;
  return `${baseURL}/film/fichefilm_gen_cfilm=${allocine}.html`;
};

const Button = ({ logo, background, children, allocine, kindURL }) => (
  <Wrapper tabIndex={0} href={getAllocineLink(allocine, kindURL)} target={"_blank"}>
    {logo && <Left background={background}>{logo}</Left>}
    {children && (
      <Right>
        <Text weight={500}>{children}</Text>
      </Right>
    )}
  </Wrapper>
);

export default Button;
