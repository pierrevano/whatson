import React, { useCallback, useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import { useStorageString } from "utils/useStorageString";
import config from "./config";
import initializeLocalStorage from "./initializeLocalStorage";
import { createFilters } from "./createFilters";
import { initializeSelectedItems } from "./initializeSelectedItems";
import { onChangeHandler } from "./onChangeHandler";
import { groupedItemTemplate } from "./groupedItemTemplate";

const ChipsDoc = () => {
  initializeLocalStorage();
  const defaultItemTypeFilters = config.item_type.split(",");

  const [item_type] = useStorageString("item_type", "");
  const [minimum_ratings_value, setMinRatingsValue] = useStorageString(
    "minimum_ratings",
    "",
  );
  const [platforms_value, setPlatformsValue] = useStorageString(
    "platforms",
    "",
  );
  const [popularity_filters, setPopularityFilters] = useStorageString(
    "popularity_filters",
    "",
  );
  const [ratings_filters, setRatingsFilters] = useStorageString(
    "ratings_filters",
    "",
  );
  const [release_date_value, setReleaseDateValue] = useStorageString(
    "release_date",
    "",
  );
  const [seasons_number, setSeasonsNumber] = useStorageString(
    "seasons_number",
    "",
  );
  const [status_value, setStatusValue] = useStorageString("status", "");

  const {
    minimum_ratings,
    platforms,
    popularity,
    ratings,
    release_date,
    seasons,
    status,
  } = createFilters(config, item_type, defaultItemTypeFilters);

  const [selectedItems, setSelectedItems] = useState(() =>
    initializeSelectedItems(
      minimum_ratings,
      minimum_ratings_value,
      platforms,
      platforms_value,
      popularity,
      popularity_filters,
      ratings,
      ratings_filters,
      release_date,
      release_date_value,
      status,
      status_value,
      seasons,
      seasons_number,
      config,
      item_type,
      defaultItemTypeFilters,
    ),
  );

  const handlePopularityFiltersUpdate = useCallback(
    (filters) => {
      if (filters === "none") return;

      const filtersArray = filters.split(",");
      if (filtersArray.length === 1 && filtersArray[0] === "") {
        setPopularityFilters("none");
      } else {
        if (filtersArray.length > 1) {
          const newFiltersArray = filtersArray.filter(
            (filter) => filter !== "none",
          );
          setPopularityFilters(newFiltersArray.join(","));
        }
      }
    },
    [setPopularityFilters],
  );

  useEffect(() => {
    handlePopularityFiltersUpdate(popularity_filters);
  }, [popularity_filters, handlePopularityFiltersUpdate]);

  const onChangeWrapper = (e) =>
    onChangeHandler(
      e,
      selectedItems,
      setSelectedItems,
      setMinRatingsValue,
      setPlatformsValue,
      setPopularityFilters,
      setRatingsFilters,
      setReleaseDateValue,
      setSeasonsNumber,
      setStatusValue,
    );

  const groupedItems =
    item_type && item_type === defaultItemTypeFilters[1]
      ? [minimum_ratings, platforms, popularity, ratings, seasons, status]
      : [minimum_ratings, release_date, popularity, ratings];

  return (
    <div className="card">
      <MultiSelect
        value={selectedItems}
        options={groupedItems}
        optionLabel="name"
        onChange={onChangeWrapper}
        optionGroupLabel="name"
        optionGroupChildren="items"
        optionGroupTemplate={groupedItemTemplate}
        placeholder="Select your filters"
        display="chip"
        pt={{
          checkboxIcon: {
            onClick: (e) => {
              e.stopPropagation();
              if (
                e.target.parentNode &&
                typeof e.target.parentNode.click === "function"
              ) {
                e.target.parentNode.click();
              }
            },
          },
          headerCheckbox: {
            onClick: (e) => {
              e.stopPropagation();
              if (
                e.target.parentNode &&
                typeof e.target.parentNode.click === "function"
              ) {
                e.target.parentNode.click();
              }
            },
          },
        }}
      />
    </div>
  );
};

export default ChipsDoc;
