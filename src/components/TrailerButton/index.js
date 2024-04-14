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
    background: ${(p) => p.theme.colors.blue};
    box-shadow: inset 0 0 0 1px ${(p) => p.theme.colors.blue};
  }
  &:focus {
    box-shadow: inset 0 0 0 0.125rem ${(p) => p.theme.colors.blue};
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

function MovieOrTVShow(props) {
  const isMovieOrTVShow = props.isMovieOrTVShow;
  if (isMovieOrTVShow === "tvshow") return <TVShow style={{ transform: "translateY(-1px)" }} size={16} strokeWidth={2.5} />;
  return <Movie size={16} strokeWidth={2.5} />;
}

const TrailerButton = ({ kindURL, setVisiblePopupAndDialogMaskBackground }) => {
  return (
    <Wrapper onClick={setVisiblePopupAndDialogMaskBackground}>
      <Left>
        <MovieOrTVShow isMovieOrTVShow={kindURL} size={16} strokeWidth={2.5} />
      </Left>
      <Right>
        <Text weight={500}>Watch trailer</Text>
      </Right>
    </Wrapper>
  );
};

export default TrailerButton;
