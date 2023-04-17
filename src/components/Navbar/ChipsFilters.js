import React, { useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import { useStorageString } from "utils/useStorageString";
import Star from "components/Icon/Star";
import NumbersFilter from "components/Icon/NumbersFilter";

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
  const metacriticCritics = { name: "Metacritic critics", code: "metacritic_critics" };
  const metacriticUsers = { name: "Metacritic users", code: "metacritic_users" };
  const ratings = {
    name: "Ratings",
    items: [allocineCritics, allocineUsers, betaseriesUsers, imdbUsers, metacriticCritics, metacriticUsers],
  };

  const one = { name: "1", code: "1" };
  const two = { name: "2", code: "2" };
  const three = { name: "3", code: "3" };
  const four = { name: "4+", code: "4" };
  const seasons = {
    name: "Seasons numbers",
    items: [one, two, three, four],
  };

  const [item_type] = useStorageString("item_type", "");
  const groupedItems = item_type && item_type === "tvshow" ? [ratings, seasons] : [ratings];
  const [ratings_filters, setRatingsFilters] = useStorageString("ratings_filters", "");
  const [seasons_number, setSeasonsNumber] = useStorageString("seasons_number", "");

  const [selectedItems, setSelectedItems] = useState([]);
  if (selectedItems.length === 0) {
    if (ratings_filters.includes("allocine_critics")) selectedItems.push(allocineCritics);
    if (ratings_filters.includes("allocine_users")) selectedItems.push(allocineUsers);
    if (ratings_filters.includes("betaseries_users")) selectedItems.push(betaseriesUsers);
    if (ratings_filters.includes("imdb_users")) selectedItems.push(imdbUsers);
    if (ratings_filters.includes("metacritic_critics")) selectedItems.push(metacriticCritics);
    if (ratings_filters.includes("metacritic_users")) selectedItems.push(metacriticUsers);

    if (item_type && item_type === "tvshow") {
      if (seasons_number.includes("1")) selectedItems.push(one);
      if (seasons_number.includes("2")) selectedItems.push(two);
      if (seasons_number.includes("3")) selectedItems.push(three);
      if (seasons_number.includes("4")) selectedItems.push(four);
    }
  }

  const groupedItemTemplate = (option) => {
    return (
      <div className="flex align-items-center" style={option.name === "Ratings" ? { transform: "translateY(-2px)" } : { transform: "translateY(-4px)" }}>
        {option.name === "Ratings" ? <Star style={{ display: "inline-block", transform: "translateY(4px)", marginLeft: "-10px", marginRight: "4px" }}></Star> : <NumbersFilter style={{ display: "inline-block", transform: "translateY(8px)", marginLeft: "-4px", marginRight: "7px" }}></NumbersFilter>}
        {option.name}
      </div>
    );
  };

  const onChangeFunction = (e) => {
    displayCheckMark();

    const valuesArray = e.value;

    const ratingsFiltersArray = [];
    const seasonsNumberArray = [];
    valuesArray.forEach((element) => {
      if (element.code === "allocine_critics" || element.code === "allocine_users" || element.code === "betaseries_users" || element.code === "imdb_users" || element.code === "metacritic_critics" || element.code === "metacritic_users") {
        ratingsFiltersArray.push(element.code);
      } else {
        seasonsNumberArray.push(element.code);
      }
    });

    setSelectedItems(e.value);
    setRatingsFilters(ratingsFiltersArray.join(","));
    setSeasonsNumber(seasonsNumberArray.join(","));
  };

  return (
    <div className="card">
      <MultiSelect value={selectedItems} options={groupedItems} optionLabel="name" onChange={(e) => onChangeFunction(e)} optionGroupLabel="name" optionGroupChildren="items" optionGroupTemplate={groupedItemTemplate} placeholder="Select your filters" display="chip" />
    </div>
  );
};

export default ChipsDoc;
