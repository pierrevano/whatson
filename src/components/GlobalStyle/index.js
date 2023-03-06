import { createGlobalStyle } from "styled-components";
import reset from "minireset.css";
import MultiSelectStyle from "./MultiSelectStyle";
import ReactConfirmStyle from "./ReactConfirmStyle";

const GlobalStyle = createGlobalStyle`
	${reset}
	${({ theme }) => `
    html,
    body {
      font-family: ${theme.fonts.default};
      background: ${theme.colors.dark};
      color: ${theme.colors.white};
      text-rendering: optimizeLegibility;
      font-smooth: antialised;
      font-smoothing: antialised;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      height: 100%;
      min-height: 100vh;
    }
    ::selection {
      color: ${theme.colors.dark};
      background: ${theme.colors.white};
    }
    #root {
      min-height: 100%;
      display: flex;
      flex-direction: column;
    }
    button {
      text-align: left;
      outline: none;
      border-radius: 0.125rem;
    }

    // Dialog player
    #dialog-player {
      border-radius: 0.25rem !important;
      box-shadow: inset 0 0 0 1px ${theme.colors.midGrey} !important;
      border: 1px solid ${theme.colors.midGrey} !important;
      width: 75vw !important;
      height: 76vh !important;
      @media (max-width: 960px) {
        width: 80vw !important;
        height: 41vh !important;
      }
      @media (max-width: 641px) {
        width: 100vw !important;
        height: 51vh !important;
      }
    }
    #dialog-player .p-dialog-header {
      background: ${theme.colors.black} !important;
      z-index: 1 !important;
    }
    #dialog-player .p-dialog-content {
      background: ${theme.colors.black} !important;
    }
    #dialog-player iframe,
    #dialog-player video {
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
    }
    #dialog-player iframe {
      height: 75vh !important;
      @media (max-width: 960px) {
        height: 40vh !important;
      }
      @media (max-width: 641px) {
        height: 50vh !important;
      }
    }

    .p-component-overlay-enter {
      background-color: rgba(0, 0, 0, 0.9) !important;
    }
    .p-component-overlay-leave {
      background-color: transparent !important;
    }

    // Multiselect style
    ${MultiSelectStyle}

    // React confirm alert style
    ${ReactConfirmStyle}
	`}
`;

export default GlobalStyle;
