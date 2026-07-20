import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import LoaderIcon from "components/LoaderIcon";
import SearchView from "components/SearchView";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import config from "./config";
import consoleMessage from "utils/consoleMessage";
import useCacheBuster from "utils/useCacheBuster";
import useAnalyticsScript from "utils/useAnalyticsScript";

const FavoritesView = lazy(() => import("components/FavoritesView"));
const DetailView = lazy(() => import("components/DetailView"));
const AboutPage = lazy(() => import("components/AboutPage"));

const SearchViewRoute = () => {
  const { kindURL } = useParams();
  return <SearchView kindURL={kindURL} />;
};

const DetailViewRoute = () => {
  const { kindURL, id } = useParams();
  return <DetailView kindURL={kindURL} id={id} />;
};

/**
 * Top-level application shell. Renders navigation, footer, and route
 * content through react-router-dom once the API health check succeeds.
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
      } catch {
        setLoading(false);
      }
    };

    checkAPIStatus();
  }, []);

  if (loading) {
    return <LoaderIcon />;
  }

  return (
    <>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Suspense fallback={<LoaderIcon />}>
          <Routes>
            <Route path="/" element={<SearchView isSearchable={false} />} />
            <Route path="/search" element={<SearchView kindURL="search" />} />
            <Route path="/favorites" element={<FavoritesView />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/:kindURL" element={<SearchViewRoute />} />
            <Route path="/:kindURL/:id" element={<DetailViewRoute />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </>
  );
};

export default App;
