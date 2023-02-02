import React from "react";
import styled from "styled-components";
import { Location } from "@reach/router";
import Link from "components/Link";
import Container from "components/Container";
import { Heart, Search } from "components/Icon";
import Item from "./Item";
import ChipsDoc from "./ChipsFilters";
import AutocompleteTheaters from "./AutocompleteTheaters";
import Pin from "components/Icon/Pin";
import Star from "components/Icon/Star";

const StickyContainer = styled(Container)`
  top: 0;
  position: sticky;
  z-index: 2;
  background: ${(p) => p.theme.colors.dark};
  margin: 0.5rem auto;
`;

const Wrapper = styled.div`
  padding: 1.25rem 0 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  text-decoration: none;
  color: currentColor;
  margin: -0.5rem;
  padding: 0.5rem;
  border-radius: 2rem;
  user-select: none;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: 100px;
  font-size: 1.75rem;
  height: 40px;
  width: 40px;
  &:focus {
    ${(p) => p.theme.focusShadow}
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const linkStyle = `
  display: block;
  text-decoration: none;
  color: currentColor;
  margin: -0.75rem;
  padding: 0.75rem;
  border-radius: 2rem;
  user-select: none;
  cursor: pointer;
  margin-right: 0rem;
  &:last-child {
    margin-right: -0.75rem;
  }
`;

const StyledLink = styled.a`
  background: none;
  border: none;
  appearance: none;
  ${linkStyle}
  &:focus {
    ${(p) => p.theme.focusShadow}
  }
`;

const StyledLinkInput = styled(StyledLink)`
  padding: 0.063rem 0.75rem;
  margin-left: 0.25rem;
  @media (max-width: 600px) {
    display: none;
  }
`;

const StyledLinkIcons = styled(StyledLink)`
  @media (min-width: 600px) {
    display: none;
  }
`;

const displayRatingsFilters = () => {
  if (document.querySelector(".theatersSearch").style.display === "block") {
    document.querySelector(".theatersSearch").style.display = "none";
    document.querySelector(".ratingsFilters").style.display = "block";
  } else if (document.querySelector(".ratingsFilters").style.display === "none" || document.querySelector(".ratingsFilters").style.display === "") {
    document.querySelector(".ratingsFilters").style.display = "block";
  } else {
    document.querySelector(".ratingsFilters").style.display = "none";
  }
};

const displayTheatersInput = () => {
  if (document.querySelector(".ratingsFilters").style.display === "block") {
    document.querySelector(".ratingsFilters").style.display = "none";
    document.querySelector(".theatersSearch").style.display = "block";
  } else if (document.querySelector(".theatersSearch").style.display === "none" || document.querySelector(".theatersSearch").style.display === "") {
    document.querySelector(".theatersSearch").style.display = "block";
  } else {
    document.querySelector(".theatersSearch").style.display = "none";
  }
};

const Navbar = () => (
  <StickyContainer>
    <Wrapper>
      <Logo tabIndex={0} to="/">
        <span role="img" aria-label="logo">
          <img style={{ maxWidth: "24px" }} src="https://whatson-public.surge.sh/logo.png" alt="logo"></img>
        </span>
      </Logo>
      <Location>
        {({ location: { pathname } }) => (
          <Flex>
            <StyledLinkInput className="ratingsFilters">
              <ChipsDoc></ChipsDoc>
            </StyledLinkInput>
            <StyledLinkInput className="theatersSearch">
              <AutocompleteTheaters></AutocompleteTheaters>
            </StyledLinkInput>
            <StyledLinkIcons>
              <Star onClick={displayRatingsFilters} style={{ margin: "-0.75rem -0.35rem -0.75rem 0.1rem" }}></Star>
            </StyledLinkIcons>
            <StyledLinkIcons>
              <Pin onClick={displayTheatersInput} style={{ transform: "translateY(1px)" }}></Pin>
            </StyledLinkIcons>
            <Item to="/favorites" active={pathname === "/favorites"}>
              <Heart filled={pathname === "/favorites"} style={{ transform: "translateY(1px)" }} />
            </Item>
            <Item to="/search" active={pathname === "/search"}>
              <Search filled={pathname === "/search"} style={{ transform: "translateY(-1px)" }} />
            </Item>
          </Flex>
        )}
      </Location>
    </Wrapper>
  </StickyContainer>
);

export default Navbar;
