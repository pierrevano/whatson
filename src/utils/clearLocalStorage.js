import React from "react";
import { confirmAlert } from "react-confirm-alert";
import config from "utils/config";

const base_render_website = config.base_render_website;

export const callConfirmAlert = () => {
  const clearAndReload = () => {
    window.localStorage.clear();
    window.open(`${base_render_website}`, "_top");
  };

  window.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      clearAndReload();
    }
  });

  const options = {
    customUI: ({ onClose }) => {
      return (
        <div className="custom-ui">
          <h1>Are you sure?</h1>
          <p>You want to reset your preferences?</p>
          <button onClick={onClose}>No</button>
          <button
            onClick={() => {
              clearAndReload();
            }}
          >
            Yes
          </button>
        </div>
      );
    },
  };
  confirmAlert(options);
};
