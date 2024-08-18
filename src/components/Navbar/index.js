import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Location } from "@reach/router";
import Link from "components/Link";
import Container from "components/Container";
import { Heart, Search } from "components/Icon";
import Item from "./Item";
import { clearAndReload } from "utils/clearLocalStorage";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Sidebar } from "primereact/sidebar";
import Menu from "components/Icon/Menu";
import config from "utils/config";
import SidebarFilters from "./SidebarFilters";

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

  useEffect(() => {
    window.addEventListener("keydown", searchShortcut);
    return () => window.removeEventListener("keydown", searchShortcut);
  }, []);

  const [shortcutKey, setShortcutKey] = useState("⌘");

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf("Mac") !== -1) {
      setShortcutKey("⌘");
    } else {
      setShortcutKey("Ctrl");
    }
  }, []);

  return (
    <StickyContainer>
      <Wrapper>
        <Menu
          onClick={() => setVisibleLeft(true)}
          style={{ transform: "translateY(1px)", cursor: "pointer" }}
        ></Menu>
        <Logo tabIndex={0} to="/">
          <span
            role="img"
            aria-label="logo"
            style={{ position: "absolute", left: "45px" }}
            onClick={() => (window.location.href = "/")}
          >
            <img
              style={{ marginTop: "5px", maxWidth: "24px" }}
              src={config.base_render + "/logo.png"}
              alt="logo"
              width="24px"
              height="24px"
            />
          </span>
        </Logo>
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
              <SidebarFilters />
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
                <Flex className="flex-search">
                  <Search
                    filled={pathname === "/search"}
                    className="search-icon"
                    style={{ transform: "translateY(-1px)" }}
                    aria-label="Search for a movie, tvshow or person"
                  />
                  <span
                    className="shortcut-key"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {shortcutKey} + K
                  </span>
                </Flex>
              </Item>
            </Flex>
          )}
        </Location>
      </Wrapper>
    </StickyContainer>
  );
};

export default Navbar;
