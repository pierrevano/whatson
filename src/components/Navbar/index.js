import React, { useState, useRef, useEffect } from "react";
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
import Cross from "components/Icon/Cross";
import CheckMark from "components/Icon/CheckMark";
import useWindowDimensions from "utils/useWindowDimensions";

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
  margin: -0.75rem 8px;
`;

const StyledLinkIcons = styled(StyledLink)`
  @media (min-width: 700px) {
    display: none;
  }
`;

const config = {
  ratingsSelector: ".ratings-filters",
  theatersSelector: ".theaters-search",
  checkMarkSelector: ".check-mark",
  crossMarkSelector: ".cross-mark",
  navbarDiv: ".navbar-div",
};

const navbarDiv = config.navbarDiv;
const checkMarkSelector = config.checkMarkSelector;
const ratingsSelector = config.ratingsSelector;
const theatersSelector = config.theatersSelector;
const crossMarkSelector = config.crossMarkSelector;

const displayRatingsOrTheaters = (notSelector) => {
  const navbarDivSelectors = `${navbarDiv} > *:not(${notSelector}):not(${checkMarkSelector})`;
  const navbarDivElements = document.querySelectorAll(navbarDivSelectors);
  const flexGrowElement = document.querySelector(navbarDiv);
  navbarDivElements.forEach((element) => {
    element.classList.toggle("display-none");
  });
  flexGrowElement.classList.toggle("flex-grow");
};

const cancel = () => {
  const ratingsFilters = document.querySelector(ratingsSelector);
  const theatersSearch = document.querySelector(theatersSelector);

  const ratingsAndCrossSelector = `${ratingsSelector},${crossMarkSelector}`;
  const theatersAndCrossSelector = `${theatersSelector},${crossMarkSelector}`;
  const ratingsFiltersAndCross = document.querySelectorAll(ratingsAndCrossSelector);
  const theatersSearchAndCross = document.querySelectorAll(theatersAndCrossSelector);

  const removeClasses = (notSelector) => {
    const navbarDivSelectors = `${navbarDiv} > *:not(${notSelector}):not(${checkMarkSelector})`;
    const navbarDivElements = document.querySelectorAll(navbarDivSelectors);
    navbarDivElements.forEach((element) => {
      element.classList.remove("display-none");
    });
    const flexGrowElement = document.querySelector(navbarDiv);
    flexGrowElement.classList.remove("flex-grow");
  };

  if (ratingsFilters.classList.contains("display-none")) {
    removeClasses(ratingsSelector);
    theatersSearchAndCross.forEach((element) => {
      element.classList.add("display-none");
    });
  }
  if (theatersSearch.classList.contains("display-none")) {
    removeClasses(theatersSelector);
    ratingsFiltersAndCross.forEach((element) => {
      element.classList.add("display-none");
    });
  }
};

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const toast = useRef(null);

  const accept = () => {
    toast.current.show({ severity: "info", summary: "Confirmation", detail: "Enjoy your fresh start!", life: 3000 });
    setTimeout(clearAndReload, 3000);
  };

  const { width } = useWindowDimensions();
  useEffect(() => {
    if (width > 700) {
      const ratingsAndTheatersSelectors = `${ratingsSelector},${theatersSelector}`;
      const ratingsAndTheaters = document.querySelectorAll(ratingsAndTheatersSelectors);
      ratingsAndTheaters.forEach((element) => {
        element.classList.remove("display-none");
      });
    }
  });

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
            <Flex className="navbar-div">
              <StyledLinkInput className="ratings-filters display-none">
                <ChipsDoc></ChipsDoc>
              </StyledLinkInput>
              <StyledLinkInput className="theaters-search display-none">
                <AutocompleteTheaters></AutocompleteTheaters>
              </StyledLinkInput>
              <StyledLink>
                <Toast ref={toast} />
                <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="Are you sure you want to proceed?" header="Clear my preferences" accept={accept} />
                <Trash onClick={() => setVisible(true)} icon="pi pi-check" label="Confirm" style={{ marginRight: "-10px" }}></Trash>
              </StyledLink>
              <StyledLinkIcons>
                <Star onClick={() => displayRatingsOrTheaters(".theaters-search")} style={{ marginRight: "-10px" }}></Star>
              </StyledLinkIcons>
              <StyledLinkIcons>
                <Pin onClick={() => displayRatingsOrTheaters(".ratings-filters")} style={{ marginRight: "-4px", transform: "translateY(1px)" }}></Pin>
              </StyledLinkIcons>
              <StyledLinkIcons className="check-mark display-none">
                <CheckMark onClick={() => window.location.reload()}></CheckMark>
              </StyledLinkIcons>
              <StyledLinkIcons className="cross-mark display-none">
                <Cross onClick={cancel}></Cross>
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
