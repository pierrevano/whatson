import React from "react";
import styled from "styled-components";
import { Location } from "@reach/router";
import Link from "components/Link";
import Container from "components/Container";
import { Heart, Search } from "components/Icon";
import Item from "./Item";
import ChipsDoc from "./ChipsFilters";

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
            <ChipsDoc></ChipsDoc>
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
