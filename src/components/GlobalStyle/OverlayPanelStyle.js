const OverlayPanelStyle = `
  .rating_details {
    z-index: 1 !important;
    box-shadow: 0px 0px 0px 1px #11481e, 0px 1px 0px 2px #0d3817,
      0px 3px 3px 1px #0003 !important;
  }
  .rating_value span:first-child {
    color: #28a745 !important;
  }
  .rating_value span:last-child {
    color: rgba(255, 255, 255, 0.4) !important;
  }
  
  .p-overlaypanel {
    border-color: rgba(255, 255, 255, 0.4) !important;
    &:before {
      border-width: 0 !important;
    }
    &:after {
      border-width: 0 !important;
    }
  }
  .p-overlaypanel-flipped {
    border-color: rgba(255, 255, 255, 0.4) !important;
    margin-top: -10px !important;
    &:before {
      border-bottom-color: transparent !important;
      border-top-color: rgba(255, 255, 255, 0.4) !important;
    }
  }
  .p-overlaypanel-logo {
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    border-radius: 6px !important;
    width: 32px !important;
    height: 32px !important;
  }

  .p-datatable-tbody a,
  .imdb-link {
    color: rgba(255, 255, 255, 0.87) !important;
    text-decoration: none !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4) !important;
  }
`;

export default OverlayPanelStyle;
