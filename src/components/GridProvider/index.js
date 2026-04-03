import { ThemeProvider } from "styled-components";

const GridProvider = ({ breakpoints, children, columns }) => (
  <ThemeProvider
    theme={(parentTheme) => ({
      ...parentTheme,
      griding: { breakpoints, columns },
    })}
  >
    {children}
  </ThemeProvider>
);

export default GridProvider;
