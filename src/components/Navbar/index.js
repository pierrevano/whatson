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
import Filter from "components/Icon/Filter";
import { clearAndReload } from "utils/clearLocalStorage";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import Cross from "components/Icon/Cross";
import CheckMark from "components/Icon/CheckMark";
import { Sidebar } from "primereact/sidebar";
import Menu from "components/Icon/Menu";
import { displayRatingsOrTheaters, cancel } from "./DisplayFilters";
import config from "utils/config";

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
  position: relative;
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

const StyledLink = styled.div`
  cursor: pointer;
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

const setItemType = (type) => {
  localStorage.setItem("item_type", type);

  const homePageUrl = new URL(window.location.origin);
  homePageUrl.searchParams.set("item_type", type);

  window.history.replaceState({}, "", homePageUrl.href);
  window.location.href = homePageUrl.href;
};

const searchShortcut = (event) => {
  if (event.key === "k") {
    const ctrlPress =
      navigator.userAgent.indexOf("Mac") !== -1 ? event.metaKey : event.ctrlKey;
    if (ctrlPress) document.getElementsByClassName("searchItem")[0].click();
  }
};

/**
 * A functional component that renders the navbar of the website.
 * @returns {JSX.Element} - The JSX code that renders the navbar.
 */
const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [visibleLeft, setVisibleLeft] = useState(false);

  const toast = useRef(null);

  const accept = () => {
    toast.current.show({
      severity: "info",
      summary: "Confirmation",
      detail: "Enjoy your fresh start!",
      life: 3000,
    });
    setTimeout(clearAndReload, 3000);
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    window.screen.width <= 700 ? setIsMobile(true) : setIsMobile(false);
  }, []);
  function detectWindowSize() {
    window.innerWidth <= 700 ? setIsMobile(true) : setIsMobile(false);
  }
  window.onresize = detectWindowSize;

  useEffect(() => {
    window.addEventListener("keydown", searchShortcut);
    return () => window.removeEventListener("keydown", searchShortcut);
  }, []);

  return (
    <StickyContainer>
      <Wrapper>
        <Logo tabIndex={0} to="/">
          <span
            role="img"
            aria-label="logo"
            style={{ transform: "translateY(1px)" }}
            onClick={() => (window.location.href = "/")}
          >
            <img
              style={{ marginTop: "5px", maxWidth: "24px" }}
              src={config.base_render + "/logo.png"}
              alt="logo"
              width="24px"
              height="24px"
            ></img>
          </span>
        </Logo>
        <Menu
          onClick={() => setVisibleLeft(true)}
          style={{
            position: "absolute",
            marginLeft: "35px",
            transform: "translateY(1px)",
            cursor: "pointer",
          }}
        ></Menu>
        <Sidebar
          visible={visibleLeft}
          onHide={() => setVisibleLeft(false)}
          style={{ position: "relative" }}
        >
          <h1>
            <strong>Switch to</strong>
          </h1>
          <br />
          <span
            className="pi pi-ticket"
            style={{ transform: "translateY(2px)", marginRight: "10px" }}
          ></span>
          <span onClick={() => setItemType("movie")}>Movies</span>
          <br />
          <br />
          <span
            className="pi pi-video"
            style={{ transform: "translateY(2px)", marginRight: "10px" }}
          ></span>
          <span onClick={() => setItemType("tvshow")}>TV Shows</span>
          <span
            className="pi pi-trash"
            style={{ position: "absolute", bottom: "22px", left: "20px" }}
          ></span>
          <span
            style={{ position: "absolute", bottom: "20px", left: "50px" }}
            onClick={() => setVisible(true)}
          >
            Reset Preferences
          </span>
          <Toast ref={toast} />
          <ConfirmDialog
            visible={visible}
            onHide={() => setVisible(false)}
            message="Are you sure you want to proceed?"
            header="Clear my preferences"
            accept={accept}
          />
        </Sidebar>
        <Location>
          {({ location: { pathname } }) => (
            <Flex className="navbar-div">
              <StyledLinkInput
                className={
                  isMobile ? "ratings-filters display-none" : "ratings-filters"
                }
              >
                <ChipsDoc></ChipsDoc>
              </StyledLinkInput>
              <StyledLink className="check-mark display-none">
                <CheckMark onClick={() => window.location.reload()}></CheckMark>
              </StyledLink>
              <StyledLinkInput
                className={
                  isMobile ? "theaters-search display-none" : "theaters-search"
                }
              >
                <AutocompleteTheaters></AutocompleteTheaters>
              </StyledLinkInput>
              <StyledLinkIcons>
                <Filter
                  onClick={() => {
                    displayRatingsOrTheaters(".theaters-search");
                    document.querySelector(".p-multiselect-trigger").click();
                  }}
                  style={{ marginRight: "-4px" }}
                ></Filter>
              </StyledLinkIcons>
              <StyledLinkIcons>
                <Pin
                  onClick={() => {
                    displayRatingsOrTheaters(".ratings-filters");
                    document.getElementById("ac").focus();
                  }}
                  style={{ marginRight: "-4px", transform: "translateY(1px)" }}
                ></Pin>
              </StyledLinkIcons>
              <StyledLinkIcons className="cross-mark display-none">
                <Cross onClick={cancel}></Cross>
              </StyledLinkIcons>
              <Item
                to="/favorites"
                active={pathname === "/favorites"}
                className="favoritesItem"
                title="View or edit your favorites"
              >
                <span title="View or edit your favorites">
                  <Heart
                    filled={pathname === "/favorites"}
                    style={{
                      marginRight: "-7px",
                      transform: "translateY(1px)",
                    }}
                    aria-label="View or edit your favorites"
                  />
                </span>
              </Item>
              <Item
                to="/search"
                active={pathname === "/search"}
                className="searchItem"
                title="Shortcut: CMD/CTRL + K"
              >
                <span title="Shortcut: CMD/CTRL + K">
                  <Search
                    filled={pathname === "/search"}
                    style={{ transform: "translateY(-1px)" }}
                    aria-label="Search for a movie, tvshow or person"
                  />
                </span>
              </Item>
            </Flex>
          )}
        </Location>
      </Wrapper>
    </StickyContainer>
  );
};

export default Navbar;
