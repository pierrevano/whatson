import React, { Suspense } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "typeface-roboto";
import { ThemeProvider } from "styled-components";
import { Provider as GridProvider } from "griding";
import GlobalStyle from "components/GlobalStyle";
import * as theme from "./theme";
import { unregister } from "serviceWorker";
import { Provider as FavoritesProvider } from "utils/favorites";

const App = React.lazy(() => import("./App"));

/**
 * A wrapper component that provides the theme, grid, and favorites context to the App component.
 * @returns The App component wrapped in the necessary context providers and global styles.
 */
const Wrapper = () => (
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    authorizationParams={{ redirect_uri: window.location.origin }}
    useRefreshTokens={true}
    cacheLocation="localstorage"
  >
    <ThemeProvider theme={theme}>
      <GridProvider columns={theme.columns} breakpoints={theme.breakpoints}>
        <FavoritesProvider>
          <Suspense fallback={null}>
            <App />
          </Suspense>
          <GlobalStyle />
        </FavoritesProvider>
      </GridProvider>
    </ThemeProvider>
  </Auth0Provider>
);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element '#root' not found");
}

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, <Wrapper />);
} else {
  createRoot(rootElement).render(<Wrapper />);
}

unregister();
