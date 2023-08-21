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
import config from "./config";
import initializeLocalStorage from "./initializeLocalStorage";

const ChipsDoc = () => {
  const displayCheckMark = () => {
    const crossMarkSelector = config.crossMarkSelector;
    const checkMarkSelector = config.checkMarkSelector;
    document.querySelector(crossMarkSelector).classList.add("display-none");
    document.querySelector(checkMarkSelector).classList.remove("display-none");
  };

  const allocinePopularity = { name: "AlloCiné popularity", code: "allocine_popularity" };
  const imdbPopularity = { name: "IMDb popularity", code: "imdb_popularity" };
  const popularity = {
    name: "Popularity",
    items: [allocinePopularity, imdbPopularity],
  };

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
  const four = { name: "4", code: "4" };
  const five = { name: "5+", code: "5" };
  const seasons = {
    name: "Seasons numbers",
    items: [one, two, three, four, five],
  };

  const canceled = { name: "Canceled", code: "canceled" };
  const ended = { name: "Ended", code: "ended" };
  const ongoing = { name: "Ongoing", code: "ongoing" };
  const pilot = { name: "Pilot", code: "pilot" };
  const soon = { name: "Soon", code: "soon" };
  const status = {
    name: "Status",
    items: [canceled, ended, ongoing, pilot, soon],
  };

  initializeLocalStorage();

  const [item_type] = useStorageString("item_type", "");

  const groupedItems = item_type && item_type === "tvshow" ? [popularity, ratings, seasons, status] : [popularity, ratings];

  const defaultPopularityFilters = config.popularity.split(",");
  const defaultRatingsFilters = config.ratings.split(",");
  const defaultSeasonsNumber = config.seasons.split(",");
  const defaultStatusValue = config.status.split(",");

  const [popularity_filters, setPopularityFilters] = useStorageString("popularity_filters", "");
  const [ratings_filters, setRatingsFilters] = useStorageString("ratings_filters", "");
  const [seasons_number, setSeasonsNumber] = useStorageString("seasons_number", "");
  const [status_value, setStatusValue] = useStorageString("status", "");

  const [selectedItems, setSelectedItems] = useState(() => {
    const selectedItems = [];

    const filterLookup = {
      allocine_popularity: allocinePopularity,
      imdb_popularity: imdbPopularity,

      allocine_critics: allocineCritics,
      allocine_users: allocineUsers,
      betaseries_users: betaseriesUsers,
      imdb_users: imdbUsers,
      metacritic_critics: metacriticCritics,
      metacritic_users: metacriticUsers,

      1: one,
      2: two,
      3: three,
      4: four,
      5: five,

      canceled: canceled,
      ended: ended,
      ongoing: ongoing,
      pilot: pilot,
      soon: soon,
    };

    defaultRatingsFilters.forEach((filter) => {
      if (!ratings_filters || ratings_filters.includes(filter)) {
        selectedItems.push(filterLookup[filter]);
      }
    });

    defaultPopularityFilters.forEach((filter) => {
      if (!popularity_filters || popularity_filters.includes(filter)) {
        selectedItems.push(filterLookup[filter]);
      }
    });

    if (item_type && item_type === "tvshow") {
      defaultSeasonsNumber.forEach((filter) => {
        if (!seasons_number || seasons_number.includes(filter)) {
          selectedItems.push(filterLookup[filter]);
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

  const groupedItemTemplate = (option) => {
    return (
      <div className="flex align-items-center" style={option.name === "Popularity" ? { transform: "translateY(-5px)" } : option.name === "Ratings" ? { transform: "translateY(-2px)" } : option.name === "Seasons numbers" ? { transform: "translateY(-4px)", marginTop: "-6px" } : { transform: "translateY(-4px)", marginTop: "-4px" }}>
        {option.name === "Popularity" ? <Trophy style={{ display: "inline-block", transform: "translateY(7px)", marginLeft: "-2px", marginRight: "8px" }}></Trophy> : option.name === "Ratings" ? <Star style={{ display: "inline-block", transform: "translateY(4px)", marginLeft: "-10px", marginRight: "4px" }}></Star> : option.name === "Seasons numbers" ? <NumbersFilter style={{ display: "inline-block", transform: "translateY(8px)", marginLeft: "-4px", marginRight: "7px" }}></NumbersFilter> : <Calendar strokeWidth={3} style={{ display: "inline-block", transform: "translateY(6px)", marginLeft: "-1px", marginRight: "9px" }}></Calendar>}
        {option.name}
      </div>
    );
  };

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

    const popularityFiltersArray = [];
    const ratingsFiltersArray = [];
    const seasonsNumberArray = [];
    const statusValueArray = [];
    valuesArray.forEach((element) => {
      if (element.code === "allocine_popularity" || element.code === "imdb_popularity") {
        popularityFiltersArray.push(element.code);
      } else if (element.code === "allocine_critics" || element.code === "allocine_users" || element.code === "betaseries_users" || element.code === "imdb_users" || element.code === "metacritic_critics" || element.code === "metacritic_users") {
        ratingsFiltersArray.push(element.code);
      } else if (element.code === "1" || element.code === "2" || element.code === "3" || element.code === "4" || element.code === "5") {
        seasonsNumberArray.push(element.code);
      } else {
        statusValueArray.push(element.code);
      }
    });

    setSelectedItems(e.value);
    setPopularityFilters(popularityFiltersArray.join(","));
    setRatingsFilters(ratingsFiltersArray.join(","));
    setSeasonsNumber(seasonsNumberArray.join(","));
    setStatusValue(statusValueArray.join(","));
  };

  return (
    <div className="card">
      <MultiSelect value={selectedItems} options={groupedItems} optionLabel="name" onChange={(e) => onChangeFunction(e)} optionGroupLabel="name" optionGroupChildren="items" optionGroupTemplate={groupedItemTemplate} placeholder="Select your filters" display="chip" />
    </div>
  );
};

export default ChipsDoc;
