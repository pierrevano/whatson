import React, { useCallback, useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import { useStorageString } from "utils/useStorageString";
import Star from "components/Icon/Star";
import NumbersFilter from "components/Icon/NumbersFilter";
import Calendar from "components/Icon/Calendar";
import Trophy from "components/Icon/Trophy";
import UpRightArrow from "components/Icon/UpRightArrow";
import config from "./config";
import initializeLocalStorage from "./initializeLocalStorage";

function createItems(nameArray, origin) {
  return nameArray.map((name) => {
    const processedName = name.toLowerCase().replaceAll("allociné", "allocine").replaceAll("rotten tomatoes", "rottenTomatoes").replaceAll(" ", "_");
    const capitalizedFirstLetterName = name.charAt(0).toUpperCase() + name.slice(1);
    return { name: capitalizedFirstLetterName, code: processedName, origin };
  });
}

function createLookup(itemsArray) {
  return itemsArray.reduce((lookup, item) => {
    lookup[item.code] = item;
    return lookup;
  }, {});
}

const displayCheckMark = () => {
  document.querySelector(config.crossMarkSelector).classList.add("display-none");
  document.querySelector(config.checkMarkSelector).classList.remove("display-none");
};

const groupedItemTemplate = (option) => {
  let style, IconComponent;

  switch (option.name) {
    case "Minimum ratings":
      style = { transform: "translateY(-4px)", marginTop: "-4px" };
      IconComponent = <UpRightArrow style={{ display: "inline-block", transform: "translateY(9px)", marginLeft: "-4px", marginRight: "4px" }}></UpRightArrow>;
      break;
    case "Popularity":
      style = { transform: "translateY(-5px)" };
      IconComponent = <Trophy style={{ display: "inline-block", transform: "translateY(7px)", marginLeft: "-2px", marginRight: "8px" }}></Trophy>;
      break;
    case "Ratings":
      style = { transform: "translateY(-2px)" };
      IconComponent = <Star style={{ display: "inline-block", transform: "translateY(4px)", marginLeft: "-10px", marginRight: "4px" }}></Star>;
      break;
    case "Seasons numbers":
      style = { transform: "translateY(-4px)", marginTop: "-6px" };
      IconComponent = <NumbersFilter style={{ display: "inline-block", transform: "translateY(8px)", marginLeft: "-4px", marginRight: "7px" }}></NumbersFilter>;
      break;
    default:
      style = { transform: "translateY(-4px)", marginTop: "-4px" };
      IconComponent = <Calendar strokeWidth={3} style={{ display: "inline-block", transform: "translateY(6px)", marginLeft: "-1px", marginRight: "9px" }}></Calendar>;
  }

  return (
    <div className="flex align-items-center" style={style}>
      {IconComponent}
      {option.name}
    </div>
  );
};

const ChipsDoc = () => {
  initializeLocalStorage();

  const [item_type] = useStorageString("item_type", "");
  const [minimum_ratings_value, setMinRatingsValue] = useStorageString("minimum_ratings", "");
  const [popularity_filters, setPopularityFilters] = useStorageString("popularity_filters", "");
  const [ratings_filters, setRatingsFilters] = useStorageString("ratings_filters", "");
  const [seasons_number, setSeasonsNumber] = useStorageString("seasons_number", "");
  const [status_value, setStatusValue] = useStorageString("status", "");

  const defaultMinRatingsValue = config.minimum_ratings.split(",");
  const minimum_ratings = {
    name: "Minimum ratings",
    items: createItems(defaultMinRatingsValue, "minimum_ratings"),
  };

  const defaultPopularityFilters = config.popularity.split(",");
  const popularity = {
    name: "Popularity",
    items: createItems(config.popularity_names.split(","), "popularity"),
  };

  const defaultRatingsFilters = config.ratings.split(",");
  const ratings = {
    name: "Ratings",
    items: createItems(config.ratings_names.split(","), "ratings"),
  };

  const defaultItemTypeFilters = config.item_type.split(",");
  if (item_type && item_type === defaultItemTypeFilters[0]) {
    const letterboxdUsers = { name: "Letterboxd users", code: "letterboxd_users", origin: "ratings" };
    ratings.items.splice(4, 0, letterboxdUsers);
  }

  const defaultSeasonsNumber = config.seasons.split(",");
  const seasons = {
    name: "Seasons numbers",
    items: createItems(defaultSeasonsNumber, "seasons"),
  };

  const defaultStatusValue = config.status.split(",");
  const status = {
    name: "Status",
    items: createItems(defaultStatusValue, "status"),
  };

  const [selectedItems, setSelectedItems] = useState(() => {
    const selectedItems = [];

    const minRatingsLookup = createLookup(minimum_ratings.items);
    defaultMinRatingsValue.forEach((filter) => {
      const minimum_ratings_array = minimum_ratings_value.split(",").map(Number);
      if (!minimum_ratings_value || minimum_ratings_array.includes(Number(filter))) {
        selectedItems.push(minRatingsLookup[filter]);
      }
    });

    const filterLookup = createLookup([...popularity.items, ...ratings.items, ...status.items]);
    defaultPopularityFilters.forEach((filter) => {
      if (!popularity_filters || popularity_filters.includes(filter)) {
        selectedItems.push(filterLookup[filter]);
      }
    });

    defaultRatingsFilters.forEach((filter) => {
      if (!ratings_filters || ratings_filters.includes(filter)) {
        selectedItems.push(filterLookup[filter]);
      }
    });

    if (item_type && item_type === defaultItemTypeFilters[1]) {
      const seasonsLookup = createLookup(seasons.items);
      defaultSeasonsNumber.forEach((filter) => {
        if (!seasons_number || seasons_number.includes(filter)) {
          selectedItems.push(seasonsLookup[filter]);
        }
      });

      defaultStatusValue.forEach((filter) => {
        if (!status_value || status_value.includes(filter)) {
          selectedItems.push(filterLookup[filter]);
        }
      });
    }

    return selectedItems;
  });

  const handlePopularityFiltersUpdate = useCallback(
    (filters) => {
      if (filters === "none") return;

      const filtersArray = filters.split(",");
      if (filtersArray.length === 1 && filtersArray[0] === "") {
        setPopularityFilters("none");
      } else {
        if (filtersArray.length > 1) {
          const newFiltersArray = filtersArray.filter((filter) => filter !== "none");
          setPopularityFilters(newFiltersArray.join(","));
        }
      }
    },
    [setPopularityFilters]
  );

  useEffect(() => {
    handlePopularityFiltersUpdate(popularity_filters);
  }, [popularity_filters, handlePopularityFiltersUpdate]);

  const onChangeFunction = (e) => {
    displayCheckMark();

    const valuesArray = e.value;

    const ratingsMinValueArray = [];
    const popularityFiltersArray = [];
    const ratingsFiltersArray = [];
    const seasonsNumberArray = [];
    const statusValueArray = [];

    valuesArray.forEach((element) => {
      if (element.origin === "minimum_ratings") {
        ratingsMinValueArray.push(element.code);
      } else if (element.origin === "popularity") {
        popularityFiltersArray.push(element.code);
      } else if (element.origin === "ratings") {
        ratingsFiltersArray.push(element.code);
      } else if (element.origin === "seasons") {
        seasonsNumberArray.push(element.code);
      } else if (element.origin === "status") {
        statusValueArray.push(element.code);
      }
    });

    setMinRatingsValue(ratingsMinValueArray.join(","));

    const numberOfPopularityAndRatings = e.value.filter((item) => item.origin === "popularity" || item.origin === "minimum_ratings").length;
    if (numberOfPopularityAndRatings === 0) {
      setPopularityFilters(config.popularity);
    } else {
      setPopularityFilters(popularityFiltersArray.join(","));
    }

    setRatingsFilters(ratingsFiltersArray.join(","));
    setSeasonsNumber(seasonsNumberArray.join(","));
    setStatusValue(statusValueArray.join(","));

    setSelectedItems(e.value);
  };

  const groupedItems = item_type && item_type === defaultItemTypeFilters[1] ? [minimum_ratings, popularity, ratings, seasons, status] : [minimum_ratings, popularity, ratings];

  return (
    <div className="card">
      <MultiSelect value={selectedItems} options={groupedItems} optionLabel="name" onChange={(e) => onChangeFunction(e)} optionGroupLabel="name" optionGroupChildren="items" optionGroupTemplate={groupedItemTemplate} placeholder="Select your filters" display="chip" />
    </div>
  );
};

export default ChipsDoc;
