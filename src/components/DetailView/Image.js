import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import LazyImage from "react-lazy-progressive-image";
import { Movie, TV, Person } from "components/Icon";
import AspectRatio from "components/AspectRatio";

const fill = `position: absolute; top: 0; bottom: 0; left: 0; right: 0;`;

const Wrapper = styled(AspectRatio)`
  overflow: hidden;
  object-fit: cover;
  border-radius: 0.25rem;
  background-color: ${(p) => p.theme.colors.grey};
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-color: ${(p) => p.theme.colors.dark};
  }
`;

const Img = styled.img`
  display: block;
  min-height: 100%;
  object-fit: cover;
  transition: 0.2s filter;
  ${(p) => p.loading && `filter: blur(0.5px)`}
`;

const NoImage = styled.div`
  ${fill}
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${(p) => p.theme.colors.midGrey};
`;

const Image = ({ placeholder, image, kind }) => {
  const [height, setHeight] = useState(3000);
  const [width, setWidth] = useState(2000);
  const imgEl = useRef(null);

  useEffect(() => {
    if (imgEl.current) {
      setHeight(imgEl.current.clientHeight);
      setWidth(imgEl.current.clientWidth);
    }
  }, [imgEl, image]);

  return (
    <Wrapper ratio={image ? 0.75 : 1}>
      {image ? (
        <LazyImage placeholder={placeholder} src={image}>
          {(src, loading) => <Img ref={imgEl} src={src} width={width} height={height} loading={+loading} />}
        </LazyImage>
      ) : (
        <NoImage>
          {kind === "movie" && <Movie size={96} strokeWidth={1.125} />}
          {kind === "tv" && <TV size={96} strokeWidth={1.125} />}
          {kind === "person" && <Person size={96} strokeWidth={1.125} />}
        </NoImage>
      )}
    </Wrapper>
  );
};

export default Image;
