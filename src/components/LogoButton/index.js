import React from "react";
import styled from "styled-components";
import TV from "components/Icon/TV";
import Text from "components/Text";

const Wrapper = styled.a`
  background: none;
  border: none;
  display: inline-flex;
  color: currentColor;
  text-decoration: none;
  border-radius: 0.25rem;
  box-shadow: inset 0 0 0 1px ${(p) => p.theme.colors.midGrey};
  color: ${(p) => p.theme.colors.lightGrey};
  overflow: hidden;
  margin: 1rem 0.5rem;
  @media (max-width: 980px) {
    margin: 1rem 0.5rem 0 0.5rem;
  }
  cursor: pointer;
  &:hover {
    color: ${(p) => p.theme.colors.white};
    background: ${(p) => p.theme.colors.green};
    box-shadow: inset 0 0 0 1px ${(p) => p.theme.colors.green};
  }
  &:focus {
    box-shadow: inset 0 0 0 0.125rem ${(p) => p.theme.colors.green};
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.813rem 0.5rem 0.813rem 0.875rem;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.563rem 0.875rem 0.563rem 0;
`;

const LogoButton = ({ name, link_url }) => {
  return (
    <Wrapper tabIndex={0} href={link_url} target={"_blank"} style={{ marginTop: "0" }}>
      <Left>
        <TV style={{ transform: "translateY(-1px)" }} size={16} strokeWidth={2.5} />
      </Left>
      <Right>
        <Text>{name}</Text>
      </Right>
    </Wrapper>
  );
};

export default LogoButton;
