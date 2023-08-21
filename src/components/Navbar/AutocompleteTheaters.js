import React, { useState } from "react";
import { useFetch } from "react-hooks-fetch";
import { AutoComplete } from "primereact/autocomplete";
import config from "utils/config";
import { useStorageString } from "utils/useStorageString";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

/**
 * A component that provides an autocomplete feature for selecting a cinema/theater.
 * @returns A React component that renders an autocomplete input field.
 */
const AutocompleteTheaters = () => {
  const clearLocalStorageAndReload = () => {
    setTheaterName("");
    localStorage.removeItem("cinema_id");
    window.location.reload();
  };

  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  const [theater_name, setTheaterName] = useStorageString("theater_name", "");

  const { data } = useFetch(`${config.cors_url}/https://www.allocine.fr/_/localization_city/${encodeURI(value)}`);

  const name = () => setItems(data?.values?.theaters?.map((item) => item?.node?.name.trim()));
  const setAndReload = (value) => {
    const nodeArray = data?.values?.theaters?.map((item) => item?.node);
    const nodeArrayFiltered = nodeArray.filter((node) => node.name.trim() === value);
    setTheaterName(nodeArrayFiltered[0].name.trim());
    localStorage.setItem("cinema_id", nodeArrayFiltered[0].internalId);

    window.location.reload();
  };

  return (
    <div className="card">
      <span className="p-float-label">
        <AutoComplete className="p-inputwrapper-focus" inputId="ac" placeholder="Select your cinema" value={value} suggestions={items} completeMethod={name} onChange={(e) => setValue(e.value)} onSelect={(e) => setAndReload(e.value)} />
        <label htmlFor="ac" style={{ whiteSpace: "nowrap" }}>
          {theater_name && (
            <>
              <span>{theater_name} is active</span>
              <span onClick={clearLocalStorageAndReload} style={{ marginLeft: "5px", cursor: "pointer", pointerEvents: "all" }}>
                <FontAwesomeIcon icon={faTimesCircle} />
              </span>
            </>
          )}
        </label>
      </span>
    </div>
  );
};

export default AutocompleteTheaters;
