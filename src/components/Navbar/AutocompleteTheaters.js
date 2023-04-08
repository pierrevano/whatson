import React, { useState } from "react";
import { useFetch } from "react-hooks-fetch";
import { AutoComplete } from "primereact/autocomplete";
import config from "utils/config";
import { useStorageString } from "utils/useStorageString";

/**
 * A component that provides an autocomplete feature for selecting a cinema/theater.
 * @returns A React component that renders an autocomplete input field.
 */
const AutocompleteTheaters = () => {
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  const cors_url = config.cors_url;
  const [theater_name, setTheaterName] = useStorageString("theater_name", "");

  const { data } = useFetch(`${cors_url}https://www.allocine.fr/_/localization_city/${encodeURI(value)}`);

  const name = () => setItems(data?.values?.theaters?.map((item) => item?.node?.name.trim()));
  const setAndReload = (value) => {
    const nodeArray = data?.values?.theaters?.map((item) => item?.node);
    const nodeArrayFiltered = nodeArray.filter((node) => node.name.trim() === value);
    setTheaterName(nodeArrayFiltered[0].name.trim());
    localStorage.setItem("cinema_id", nodeArrayFiltered[0].internalId);

    window.location.reload();
  };

  let theatersLabel = "";
  if (theater_name !== "") theatersLabel = `${theater_name} is active`;

  return (
    <div className="card">
      <span className="p-float-label">
        <AutoComplete className="p-inputwrapper-focus" inputId="ac" placeholder="Select your cinema" value={value} suggestions={items} completeMethod={name} onChange={(e) => setValue(e.value)} onSelect={(e) => setAndReload(e.value)} />
        <label htmlFor="ac" style={{ whiteSpace: "nowrap" }}>
          {theatersLabel}
        </label>
      </span>
    </div>
  );
};

export default AutocompleteTheaters;
