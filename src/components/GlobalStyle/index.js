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
      @media (max-width: 700px) {
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

    .ratingsFilters {
      @media (max-width: 700px) {
        margin-right: 13px !important;
      }
    }

    .theatersSearch {
      @media (min-width: 700px) {
        margin-left: -10px !important;
      }
    }

    .trashIcon {
      @media (min-width: 700px) {
        margin-left: -9px !important;
        margin-right: -3px !important;
      }
    }

    .trashIcon {
      @media (max-width: 700px) {
        margin-left: 3px !important;
      }
    }

    // React confirm alert style
    body.react-confirm-alert-body-element {
      overflow: hidden;
    }

    .react-confirm-alert-blur {
      filter: url(#gaussian-blur);
      filter: blur(2px);
      -webkit-filter: blur(2px);
    }

    .react-confirm-alert-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99;
      background: rgba(24, 24, 24, 0.9);
      display: -webkit-flex;
      display: -moz-flex;
      display: -ms-flex;
      display: -o-flex;
      display: flex;
      justify-content: center;
      -ms-align-items: center;
      align-items: center;
      opacity: 0;
      -webkit-animation: react-confirm-alert-fadeIn 0.5s 0.2s forwards;
      -moz-animation: react-confirm-alert-fadeIn 0.5s 0.2s forwards;
      -o-animation: react-confirm-alert-fadeIn 0.5s 0.2s forwards;
      animation: react-confirm-alert-fadeIn 0.5s 0.2s forwards;
    }

    .react-confirm-alert-body {
      font-family: Arial, Helvetica, sans-serif;
      width: 400px;
      padding: 30px;
      text-align: left;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 20px 75px rgba(0, 0, 0, 0.13);
      color: #666;
    }

    .react-confirm-alert-svg {
      position: absolute;
      top: 0;
      left: 0;
    }

    .react-confirm-alert-body > h1 {
      margin-top: 0;
    }

    .react-confirm-alert-body > h3 {
      margin: 0;
      font-size: 16px;
    }

    .react-confirm-alert-button-group {
      display: -webkit-flex;
      display: -moz-flex;
      display: -ms-flex;
      display: -o-flex;
      display: flex;
      justify-content: flex-start;
      margin-top: 20px;
    }

    .react-confirm-alert-button-group > button {
      outline: none;
      background: #333;
      border: none;
      display: inline-block;
      padding: 6px 18px;
      color: #eee;
      margin-right: 10px;
      border-radius: 5px;
      font-size: 12px;
      cursor: pointer;
    }

    @-webkit-keyframes react-confirm-alert-fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @-moz-keyframes react-confirm-alert-fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @-o-keyframes react-confirm-alert-fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes react-confirm-alert-fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .custom-ui {
      text-align: center;
      width: 500px;
      padding: 40px;
      box-shadow: 0 20px 75px rgba(0, 0, 0, 0.23);
      color: #fff;
      border: 1px solid;
      border-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: opacity(50%);
    }

    .custom-ui > h1 {
      margin-top: 0;
    }

    .custom-ui > button {
      width: 120px;
      padding: 10px;
      border: 1px solid #fff;
      margin: 10px;
      cursor: pointer;
      background: none;
      color: #fff;
      font-size: 14px;
      text-align: center;
    }
	`}
`;

export default GlobalStyle;
