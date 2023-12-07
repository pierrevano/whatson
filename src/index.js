import React, { Suspense } from "react";
import { hydrate, render } from "react-dom";
import "typeface-roboto";
import { ThemeProvider } from "styled-components";
import { Provider as GridProvider } from "griding";
import GlobalStyle from "components/GlobalStyle";
import * as theme from "./theme";
import { register } from "serviceWorker";
import { Provider as FavoritesProvider } from "utils/favorites";

const App = React.lazy(() => import("./App"));

/**
 * A wrapper component that provides the theme, grid, and favorites context to the App component.
 * @returns The App component wrapped in the necessary context providers and global styles.
 */
const Wrapper = () => (
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
);

const rootElement = document.getElementById("root");

if (rootElement.hasChildNodes()) {
  hydrate(<Wrapper />, rootElement);
} else {
  render(<Wrapper />, rootElement);
}

register();
