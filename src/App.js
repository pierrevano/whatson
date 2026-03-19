import React, { Fragment, useState, useEffect } from "react";
import { Router } from "@reach/router";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import LoaderIcon from "components/LoaderIcon";
import SearchView from "components/SearchView";
import FavoritesView from "components/FavoritesView";
import DetailView from "components/DetailView";
import AboutPage from "components/AboutPage";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import config from "./config";
import consoleMessage from "utils/consoleMessage";
import useCacheBuster from "utils/useCacheBuster";
import useAnalyticsScript from "utils/useAnalyticsScript";

/**
 * Top-level application shell. Renders navigation, footer, and route
 * content through @reach/router once the API health check succeeds.
 * @returns {JSX.Element} Layout wrapper for the public routes.
 */
const App = () => {
  useCacheBuster();

  useEffect(() => {
    consoleMessage();
  }, []);

  useAnalyticsScript(config.umami_script_url, config.umami_website_id);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAPIStatus = async () => {
      try {
        const response = await fetch(config.base_render_api);
        if (response.status === 200) {
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    };

    checkAPIStatus();
  }, []);

  if (loading) {
    return <LoaderIcon />;
  }

  return (
    <Fragment>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Router>
          <SearchView isSearchable={false} path="/" />
          <SearchView path="/search" kindURL="search" />
          <FavoritesView path="/favorites" />
          <AboutPage path="/about" />
          <SearchView path=":kindURL" />
          <DetailView path=":kindURL/:id" />
        </Router>
      </div>
      <Footer />
    </Fragment>
  );
};

export default App;
