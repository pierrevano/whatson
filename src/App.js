import React, { Fragment, lazy, Suspense, useState, useEffect } from "react";
import { Router } from "@reach/router";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import Loader from "components/Loader";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import config from "./config";
import consoleMessage from "utils/consoleMessage";
import useCacheBuster from "utils/useCacheBuster";
import useScript from "utils/useScript";

const SearchView = lazy(() => import("components/SearchView"));
const FavoritesView = lazy(() => import("components/FavoritesView"));
const DetailView = lazy(() => import("components/DetailView"));
const AboutPage = lazy(() => import("components/AboutPage"));

/**
 * The main component of the application. Renders the navbar, footer, and the main content
 * of the app using React Router.
 * @returns A React Fragment containing the navbar, main content, and footer.
 */
const App = () => {
  useCacheBuster();
  consoleMessage();
  useScript(config.base_beamanalytics, config.beamanalytics_token);

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
    return <Loader />;
  }

  return (
    <Fragment>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Suspense fallback={<Loader />}>
          <Router>
            <SearchView isSearchable={false} path="/" />
            <SearchView path="/search" kindURL="search" />
            <FavoritesView path="/favorites" />
            <AboutPage path="/about" />
            <SearchView path=":kindURL" />
            <DetailView path=":kindURL/:id" />
          </Router>
        </Suspense>
      </div>
      <Footer />
    </Fragment>
  );
};

export default App;
