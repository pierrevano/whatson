import { fonts } from "theme";

const ReactConfirmStyle = `
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
    font-family: ${fonts.default};
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
`;

export default ReactConfirmStyle;
