import React from "react";
import styled from "styled-components";
import Text from "components/Text";
import { Movie, TVShow } from "components/Icon";

const Wrapper = styled.button`
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
    background: ${(p) => p.theme.colors.lightDark};
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
  padding: 0.75rem 0.5rem;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.5rem 0.5rem 0;
`;

function MovieOrTVShowIcon(props) {
  const { itemKey } = props;

  if (itemKey === "chart")
    return (
      <TVShow
        style={{ transform: "translateY(-1px)" }}
        size={16}
        strokeWidth={2.5}
      />
    );

  return <Movie size={16} strokeWidth={2.5} />;
}

const DialogButton = ({ setValues, itemKey }) => (
  <Wrapper onClick={setValues}>
    <Left>
      <MovieOrTVShowIcon itemKey={itemKey} />
    </Left>
    <Right>
      <Text weight={500}>
        {itemKey === "trailer"
          ? "Watch trailer"
          : "Display episodes users ratings"}
      </Text>
    </Right>
  </Wrapper>
);

export default DialogButton;
