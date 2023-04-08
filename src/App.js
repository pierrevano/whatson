import React, { Fragment, lazy, Suspense } from "react";
import { Router } from "@reach/router";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import Loader from "components/Loader";
const SearchView = lazy(() => import("components/SearchView"));
const FavoritesView = lazy(() => import("components/FavoritesView"));
const DetailView = lazy(() => import("components/DetailView"));
const AboutPage = lazy(() => import("components/AboutPage"));

/**
 * The main component of the application. Renders the navbar, footer, and the main content
 * of the app using React Router.
 * @returns A React Fragment containing the navbar, main content, and footer.
 */
const App = () => (
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

export default App;
