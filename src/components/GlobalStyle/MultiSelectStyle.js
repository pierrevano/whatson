import { colors, fonts } from "theme";

const MultiSelectStyle = `
  .navbar-div {
    margin-left: 32px !important;
    @media (max-width: 700px) {
      margin-left: 60px !important;
    }
  }

  .card {
    display: inline-grid !important;
  }
  .card {
    @media (max-width: 700px) {
      width: 100% !important;
      flex-grow: 1 !important;
    }
  }

  .p-multiselect-items-wrapper {
    max-height: 500px !important;
  }

  .p-inputtext,
  .p-multiselect {
    background: #181818 !important;
    border-color: rgba(255, 255, 255, 0.4) !important;
    font-family: ${fonts.default} !important;
    min-width: 13rem !important;
    margin: 0 -0.5rem 0 0.5rem !important;
  }
  .p-inputtext {
    margin: 0 0.5rem 0 0 !important;
  }

  .p-inputtext,
  .p-multiselect {
    @media (max-width: 700px) {
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
  .p-inputwrapper-filled.p-multiselect.p-multiselect-chip .p-multiselect-label {
    padding: 0.375rem 0.75rem !important;
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
  .p-multiselect-panel .p-multiselect-header .p-multiselect-close:focus,
  .p-sidebar .p-sidebar-header .p-sidebar-close:focus {
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

  .p-multiselect-panel
    .p-multiselect-items
    .p-multiselect-item-group:first-child {
    padding: 0.55rem 1.25rem !important;
  }

  .p-dialog .p-dialog-header .p-dialog-header-icon:focus,
  .p-sidebar .p-sidebar-header .p-sidebar-icon:focus {
    box-shadow: 0 0 0 0.2rem rgb(40 167 69 / 50%) !important;
  }
  .p-dialog-header-icons {
    transform: translateY(2px) !important;
  }

  #dialog-chart {
    width: 75% !important;
    border: 1px solid ${colors.lightGrey} !important;
  }

  #dialog-chart_header {
    color: ${colors.lightGrey} !important;
  }

  .p-chart canvas {
    padding: 0 10px !important;
    height: 100% !important;
    width: 100% !important;
  }

  .p-checkbox .p-checkbox-box.p-highlight,
  .p-button {
    border-color: #28a745 !important;
    background: #28a745 !important;
  }
  .p-button.p-button-text {
    background-color: transparent !important;
    color: #28a745 !important;
    border-color: transparent !important;
  }
  .p-button:focus {
    box-shadow:
      0 0 0 2px #1c2127,
      0 0 0 4px rgb(40 167 69 / 70%),
      0 1px 2px 0 rgb(0 0 0 / 0%) !important;
  }

  .p-toast .p-toast-message.p-toast-message-info {
    background: #031307 !important;
    border: solid #28a745 !important;
    border-width: 0 0 0 6px !important;
    color: #28a745 !important;
  }
  .p-toast .p-toast-message.p-toast-message-info .p-toast-message-icon,
  .p-toast .p-toast-message.p-toast-message-info .p-toast-icon-close {
    color: #28a745 !important;
  }
  .p-toast {
    opacity: 1 !important;
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
    border: 2px solid rgba(40, 167, 69, 0.5) !important;
  }

  .p-input-filled .p-checkbox .p-checkbox-box.p-highlight {
    background: #28a745 !important;
  }
  .p-input-filled
    .p-checkbox:not(.p-checkbox-disabled)
    .p-checkbox-box.p-highlight:hover {
    background: #12a133 !important;
  }

  .p-listbox {
    background: #181818 !important;
    border: 0.1rem rgba(40, 167, 69, 0.5) !important;
    box-shadow: 0 0 0 0.1rem rgba(40, 167, 69, 0.5) !important;
    width: 210px;
  }
  .p-listbox-list {
    padding: 0 !important;
  }
  .p-listbox-item:focus {
    color: rgba(255, 255, 255, 0.87) !important;
    background: rgba(94, 234, 212, 0.16) !important;
  }
  .p-listbox-item {
    box-shadow: none !important;
    border: 1px solid rgba(40, 167, 69, 0.1) !important;
  }

  .p-float-label .p-placeholder,
  .p-float-label input::placeholder,
  .p-float-label .p-inputtext::placeholder {
    opacity: 1 !important;
  }

  .p-float-label > label {
    left: 0.25rem !important;
  }

  .p-dialog.p-confirm-dialog .p-confirm-dialog-message {
    margin-left: 0 !important;
  }

  .p-sidebar {
    background: #181818 !important;
  }
  .p-sidebar-content h1,
  .p-sidebar-content h2,
  .p-sidebar-content button {
    color: #fff !important;
  }
  .p-sidebar-content h1 {
    font-size: 2em !important;
  }
  .p-sidebar-content h2 {
    font-size: 1.5em !important;
  }
  .p-sidebar-content span {
    font-size: 1.2em !important;
  }
  .p-sidebar-content span:nth-child(even) {
    background-color: #181818 !important;
    border: none !important;
    border-bottom: 1px solid #fff !important;
    cursor: pointer !important;
  }

  .filter-icon {
    cursor: pointer !important;
  }

  .flex-search {
    padding: 3px;
    padding-right: 9px;
    border-radius: 10px;
    border: 1.4px solid #fff;
  }
  .menu-icon:hover,
  .filter-icon:hover,
  .heart-icon:hover,
  .flex-search:hover {
    opacity: 0.8;
  }
  .search-icon {
    margin-right: 5px;
  }
  .shortcut-key {
    display: inline;
  }

  @media (max-width: 767px) {
    .flex-search {
      padding: initial;
      padding-right: initial;
      border-radius: initial;
      border: initial;
    }
    .search-icon {
      margin-right: initial;
    }
    .shortcut-key {
      display: none;
    }
  }
`;

export default MultiSelectStyle;
