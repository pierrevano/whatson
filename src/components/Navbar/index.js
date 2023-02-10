import React, { useState, useRef } from "react";
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
import Trash from "components/Icon/Trash";
import { clearAndReload } from "utils/clearLocalStorage";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

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
  margin-right: 0.5rem;
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
  padding: 1px 12px;
  margin-left: 8px;
  margin-right: 8px;
  @media (max-width: 700px) {
    display: none;
  }
`;

const StyledLinkIcons = styled(StyledLink)`
  @media (min-width: 700px) {
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

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const toast = useRef(null);

  const accept = () => {
    toast.current.show({ severity: "info", summary: "Confirmation", detail: "You preferences have been cleared.", life: 3000 });
    setTimeout(clearAndReload, 3000);
  };

  return (
    <StickyContainer>
      <Wrapper>
        <Logo tabIndex={0} to="/">
          <span role="img" aria-label="logo">
            <img style={{ marginTop: "5px", maxWidth: "24px" }} src="https://whatson-public.surge.sh/logo.png" alt="logo"></img>
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
              <StyledLink>
                <Toast ref={toast} />
                <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="Are you sure you want to proceed?" header="Clear my preferences" accept={accept} />
                <Trash onClick={() => setVisible(true)} icon="pi pi-check" label="Confirm" style={{ marginRight: "-10px" }}></Trash>
              </StyledLink>
              <StyledLinkIcons>
                <Star onClick={displayRatingsFilters} style={{ marginRight: "-10px" }}></Star>
              </StyledLinkIcons>
              <StyledLinkIcons>
                <Pin onClick={displayTheatersInput} style={{ marginRight: "-4px", transform: "translateY(1px)" }}></Pin>
              </StyledLinkIcons>
              <Item to="/favorites" active={pathname === "/favorites"}>
                <Heart filled={pathname === "/favorites"} style={{ marginRight: "-7px", transform: "translateY(1px)" }} />
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
};

export default Navbar;
