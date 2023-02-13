import React, { useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import { useStorageString } from "utils/useStorageString";

const config = {
  ratingsSelector: ".ratings-filters",
  theatersSelector: ".theaters-search",
  checkMarkSelector: ".check-mark",
  crossMarkSelector: ".cross-mark",
  navbarDiv: ".navbar-div",
};

const displayCheckMark = () => {
  const crossMarkSelector = config.crossMarkSelector;
  const checkMarkSelector = config.checkMarkSelector;
  document.querySelector(crossMarkSelector).classList.add("display-none");
  document.querySelector(checkMarkSelector).classList.remove("display-none");
};

const ChipsDoc = () => {
  const allocineCritics = { name: "AlloCiné critics", code: "allocine_critics" };
  const allocineUsers = { name: "AlloCiné users", code: "allocine_users" };
  const betaseriesUsers = { name: "BetaSeries users", code: "betaseries_users" };
  const imdbUsers = { name: "IMDb users", code: "imdb_users" };

  const [selectedItems, setSelectedItems] = useState([]);
  const items = [allocineCritics, allocineUsers, betaseriesUsers, imdbUsers];

  const [ratings_filters, setRatingsFilters] = useStorageString("ratings_filters", "");
  if (selectedItems.length === 0) {
    if (ratings_filters.includes("allocine_critics")) selectedItems.push(allocineCritics);
    if (ratings_filters.includes("allocine_users")) selectedItems.push(allocineUsers);
    if (ratings_filters.includes("betaseries_users")) selectedItems.push(betaseriesUsers);
    if (ratings_filters.includes("imdb_users")) selectedItems.push(imdbUsers);
  }

  return (
    <div className="card">
      <MultiSelect
        value={selectedItems}
        options={items}
        onChange={(e) => {
          displayCheckMark();

          const valuesArray = e.value;

          const ratingsFiltersArray = [];
          valuesArray.forEach((element) => {
            ratingsFiltersArray.push(element.code);
          });

          setSelectedItems(e.value);
          setRatingsFilters(ratingsFiltersArray.join(","));
        }}
        optionLabel="name"
        placeholder="Select your ratings filters"
        display="chip"
      />
    </div>
  );
};

export default ChipsDoc;
