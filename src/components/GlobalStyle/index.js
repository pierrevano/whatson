import { createGlobalStyle } from "styled-components";
import reset from "minireset.css";

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

    // Multiselect style
    .card {
      display: inline-grid !important;
    }

    .p-multiselect-items-wrapper {
      max-height: 500px !important;
    }

    .p-inputtext,
    .p-multiselect {
      background: #181818 !important;
      border-color: rgba(255, 255, 255, 0.4) !important;
      font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
        "Segoe UI Symbol" !important;
      min-width: 13rem !important;
      margin: 0 -0.5rem 0 0.5rem !important;
    }
    .p-inputtext {
      margin: 0 0.5rem 0 0 !important;
    }

    .p-inputtext,
    .p-multiselect {
      @media (max-width: 600px) {
        min-width: 5rem !important;
        width: 105% !important;
        margin: 0 -0.3rem 0 0 !important;
      }
    }

    .p-inputtext::placeholder,
    .p-multiselect .p-multiselect-label.p-placeholder {
      color: rgba(255, 255, 255, 0.8) !important;
    }
    .p-multiselect .p-multiselect-trigger {
      color: rgba(255, 255, 255, 0.8) !important;
    }

    .p-inputtext:hover,
    .p-multiselect:not(.p-disabled):hover,
    .p-multiselect:not(.p-disabled).p-focus {
      border-color: #28a745 !important;
    }
    .p-inputtext:enabled:focus,
    .p-multiselect:not(.p-disabled).p-focus {
      box-shadow: 0 0 0 0.1rem rgba(40, 167, 69, 0.5) !important;
      border-color: #28a745 !important;
    }

    .p-autocomplete .p-autocomplete-multiple-container .p-autocomplete-token,
    .p-multiselect.p-multiselect-chip .p-multiselect-token {
      background: rgba(40, 167, 69, 0.16) !important;
    }

    .p-multiselect-panel .p-multiselect-header .p-multiselect-close {
      color: rgba(255, 255, 255, 0.8) !important;
    }
    .p-multiselect-panel .p-multiselect-header .p-multiselect-close:focus {
      box-shadow: 0 0 0 0.1rem rgba(40, 167, 69, 0.5) !important;
    }
    .p-multiselect-panel .p-multiselect-items .p-multiselect-item.p-highlight {
      background: rgba(40, 167, 69, 0.16) !important;
    }
    .p-multiselect-panel .p-multiselect-items .p-multiselect-item:focus {
      box-shadow: inset 0 0 0 0 rgba(40, 167, 69, 0.5) !important;
    }
    .p-multiselect-panel .p-multiselect-items .p-multiselect-item .p-checkbox {
      margin-right: 0.75rem !important;
    }

    .p-checkbox .p-checkbox-box.p-highlight {
      border-color: #28a745 !important;
      background: #28a745 !important;
    }
    .p-checkbox .p-checkbox-box.p-highlight:not(.p-disabled):hover {
      border-color: #12a133 !important;
      background: #12a133 !important;
    }
    .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box:hover {
      border-color: #28a745 !important;
    }
    .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-focus {
      box-shadow: 0 0 0 0.1rem rgba(40, 167, 69, 0.5) !important;
      border-color: #28a745 !important;
    }
    .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover {
      border-color: #12a133 !important;
      background: #12a133 !important;
    }
    .p-checkbox .p-checkbox-box {
      border: 2px solid #0f3973 !important;
    }

    .p-input-filled .p-checkbox .p-checkbox-box.p-highlight {
      background: #28a745 !important;
    }
    .p-input-filled
      .p-checkbox:not(.p-checkbox-disabled)
      .p-checkbox-box.p-highlight:hover {
      background: #12a133 !important;
    }

    .p-autocomplete .p-autocomplete-multiple-container:not(.p-disabled):hover,
    .p-chips .p-chips-multiple-container:not(.p-disabled):hover {
      border-color: #28a745 !important;
    }
    .p-autocomplete .p-autocomplete-multiple-container:not(.p-disabled).p-focus,
    .p-chips .p-chips-multiple-container:not(.p-disabled).p-focus {
      box-shadow: 0 0 0 0.1rem rgba(40, 167, 69, 0.5) !important;
      border-color: #28a745 !important;
    }
    .p-chips .p-chips-multiple-container .p-chips-token {
      background: rgba(40, 167, 69, 0.16) !important;
    }

    .p-float-label .p-placeholder,
    .p-float-label input::placeholder,
    .p-float-label .p-inputtext::placeholder {
        opacity: 1 !important;
    }

    .theatersSearch {
      @media (min-width: 600px) {
        margin-left: -0.25rem !important;
      }
    }
	`}
`;

export default GlobalStyle;
