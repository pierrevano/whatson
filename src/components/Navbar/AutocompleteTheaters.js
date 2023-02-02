import React, { useState } from "react";
import { useFetch } from "react-hooks-fetch";
import { AutoComplete } from "primereact/autocomplete";

const AutocompleteTheaters = () => {
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);

  const { data } = useFetch(`https://cors-sites-aafe82ad9d0c.fly.dev/https://www.allocine.fr/_/localization_city/${encodeURI(value)}`);

  const name = () => setItems(data?.values?.theaters?.map((item) => item?.node?.name.trim()));
  const internalId = (value) => {
    const nodeArray = data?.values?.theaters?.map((item) => item?.node);
    const nodeArrayFiltered = nodeArray.filter((node) => node.name.trim() === value);
    console.log(nodeArrayFiltered[0].internalId);
    return nodeArrayFiltered[0].internalId;
  };

  const cinemaIdBaseURL = "https://whatson.onrender.com?cinema_id=";

  return (
    <div className="card">
      <AutoComplete inputId="ac" placeholder="Select your cinema" value={value} suggestions={items} completeMethod={name} onChange={(e) => setValue(e.value)} onSelect={(e) => window.open(`${cinemaIdBaseURL}${internalId(e.value)}`, "_top")} />
    </div>
  );
};

export default AutocompleteTheaters;
