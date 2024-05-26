import React, { useState, useCallback } from "react";
import { useFetch } from "react-hooks-fetch";
import { AutoComplete } from "primereact/autocomplete";
import config from "utils/config";
import { useStorageString } from "utils/useStorageString";
import Cross from "components/Icon/Cross";

/**
 * A component that provides an autocomplete feature for selecting a cinema/theater.
 * @returns A React component that renders an autocomplete input field.
 */
const AutocompleteTheaters = () => {
  const [theater_name, setTheaterName] = useStorageString("theater_name", "");

  const clearLocalStorageAndReload = useCallback(() => {
    setTheaterName("");
    localStorage.removeItem("cinema_id");
    window.location.reload();
  }, [setTheaterName]);

  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  const { data } = useFetch(
    `${config.cors_url}/https://www.allocine.fr/_/localization_city/${encodeURI(
      value,
    )}`,
  );

  const name = useCallback(
    () =>
      setItems(
        data?.values?.theaters?.map(
          (item) => `${item?.node?.name.trim()} (${item?.node?.location?.zip})`,
        ),
      ),
    [data],
  );

  const setAndReload = useCallback(
    (value) => {
      const nodeArray = data?.values?.theaters?.map((item) => item?.node);
      const nodeArrayFiltered = nodeArray.filter(
        (node) => node.name.trim() === value.split("(")[0].trim(),
      );
      setTheaterName(nodeArrayFiltered[0]?.name.trim());
      localStorage.setItem("cinema_id", nodeArrayFiltered[0]?.internalId);

      window.location.reload();
    },
    [data, setTheaterName],
  );

  return (
    <div className="card">
      <span className="p-float-label">
        <AutoComplete
          className="p-inputwrapper-focus"
          inputId="ac"
          placeholder="Filter movies by cinema"
          value={value}
          suggestions={items}
          completeMethod={name}
          onChange={(e) => setValue(e.value)}
          onSelect={(e) => setAndReload(e.value)}
        />
        <label htmlFor="ac" style={{ whiteSpace: "nowrap" }}>
          {theater_name && (
            <>
              <span>{theater_name} is active</span>
              <span
                onClick={clearLocalStorageAndReload}
                style={{
                  marginLeft: "5px",
                  cursor: "pointer",
                  pointerEvents: "all",
                  opacity: "0.6",
                }}
              >
                <Cross
                  height={12}
                  width={12}
                  style={{ transform: "translateY(2px)" }}
                ></Cross>
              </span>
            </>
          )}
        </label>
      </span>
    </div>
  );
};

export default AutocompleteTheaters;
