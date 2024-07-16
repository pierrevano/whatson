import React, { useEffect, useState } from "react";
import { useStorageString } from "utils/useStorageString";
import config from "./config";
import initializeLocalStorage from "./initializeLocalStorage";
import { createFilters } from "./createFilters";
import { initializeSelectedItems } from "./initializeSelectedItems";
import { onChangeHandler } from "./onChangeHandler";
import { Checkbox } from "primereact/checkbox";
import { ListBox } from "primereact/listbox";
import { Sidebar } from "primereact/sidebar";
import Filter from "components/Icon/Filter";

const SidebarFilters = () => {
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

  const { minimum_ratings, platforms, ratings, release_date, seasons, status } =
    createFilters(config, item_type, defaultItemTypeFilters);

  const [visibleLeftFilters, setVisibleLeftFilters] = useState(false);

  const [selectedItems, setSelectedItems] = useState(() =>
    initializeSelectedItems(
      minimum_ratings,
      minimum_ratings_value,
      platforms,
      platforms_value,
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

  const [hasChanges, setHasChanges] = useState(false);

  const onChangeWrapper = (e) => {
    onChangeHandler(
      e,
      item_type,
      selectedItems,
      setSelectedItems,
      setMinRatingsValue,
      setPlatformsValue,
      setRatingsFilters,
      setReleaseDateValue,
      setSeasonsNumber,
      setStatusValue,
    );
    setHasChanges(true);
  };

  useEffect(() => {
    if (
      hasChanges ||
      (visibleLeftFilters &&
        localStorage.getItem("minimum_ratings") === config.minimum_ratings)
    ) {
      setTimeout(() => {
        const listItems = document.querySelectorAll(
          ".p-listbox-list .p-highlight",
        );
        if (listItems) {
          listItems.forEach((item) => item.classList.remove("p-highlight"));
        }
      }, 100);
    }
  }, [hasChanges, visibleLeftFilters]);

  const groupedItems =
    item_type && item_type === defaultItemTypeFilters[1]
      ? [release_date, minimum_ratings, platforms, ratings, seasons, status]
      : [release_date, minimum_ratings, ratings];

  return (
    <span>
      <Filter
        onClick={() => setVisibleLeftFilters(true)}
        style={{ marginRight: "17px" }}
      />
      <Sidebar
        visible={visibleLeftFilters}
        onHide={() => {
          setVisibleLeftFilters(false);
          if (hasChanges) {
            window.location.reload();
          }
        }}
      >
        <div className="card">
          {groupedItems.map((groupedItem, groupIndex) => (
            <div key={`group-${groupIndex}`} className="flex flex-column gap-3">
              <h2>
                <strong>{groupedItem.name}</strong>
              </h2>
              {groupedItem.items.map((item, itemIndex) =>
                (item.origin === "minimum_ratings" && item.code !== "4.5") ||
                (item.origin === "release_date" &&
                  item.code === "everything") ||
                (item.origin === "platforms" && item.code === "all") ? null : (
                  <div
                    key={`${groupedItem.name}-${itemIndex}`}
                    className="flex align-items-center"
                  >
                    {item.origin === "minimum_ratings" ? (
                      <ListBox
                        value={
                          selectedItems.find(
                            (selectedItem) =>
                              selectedItem.origin === "minimum_ratings",
                          ) || null
                        }
                        onChange={onChangeWrapper}
                        options={groupedItem.items}
                        optionLabel="name"
                      />
                    ) : (
                      <>
                        <Checkbox
                          inputId={`${item.code}-${itemIndex}`}
                          name={item.origin}
                          value={item.code}
                          onChange={onChangeWrapper}
                          checked={selectedItems.some(
                            (selectedItem) => selectedItem.code === item.code,
                          )}
                          title={item.name}
                        />
                        <label
                          htmlFor={`${item.code}-${itemIndex}`}
                          className="ml-2"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          {item.name}
                          {item.name === "New" && (
                            <i
                              className="pi pi-sparkles"
                              style={{ marginLeft: "7px" }}
                            ></i>
                          )}
                        </label>
                      </>
                    )}
                  </div>
                ),
              )}
              <br />
            </div>
          ))}
        </div>
      </Sidebar>
    </span>
  );
};

export default SidebarFilters;
