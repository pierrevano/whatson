import React, { useEffect, useRef, useState } from "react";
import { useStorageString } from "utils/useStorageString";
import config from "../../config";
import initializeLocalStorage from "./initializeLocalStorage";
import { createFilters } from "./createFilters";
import { initializeSelectedItems } from "./initializeSelectedItems";
import { onChangeHandler } from "./onChangeHandler";
import { Checkbox } from "primereact/checkbox";
import { ListBox } from "primereact/listbox";
import { Sidebar } from "primereact/sidebar";
import Filter from "components/Icon/Filter";
import { clearAndReload } from "utils/clearLocalStorage";
import { ConfirmDialog } from "primereact/confirmdialog";
import { shouldSendCustomEvents } from "utils/shouldSendCustomEvents";
import { Toast } from "primereact/toast";
import { useAuth0 } from "@auth0/auth0-react";

const SidebarFilters = () => {
  const { isAuthenticated, user } = useAuth0();

  initializeLocalStorage();

  const defaultItemTypeFilters = config.item_type.split(",");

  const [genres_value, setGenresValue] = useStorageString("genres", "");
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
    genres,
    minimum_ratings,
    platforms,
    popularity,
    ratings,
    release_date,
    seasons,
    status,
  } = createFilters(config, item_type, defaultItemTypeFilters);

  const [visibleLeftFilters, setVisibleLeftFilters] = useState(false);

  const [selectedItems, setSelectedItems] = useState(() =>
    initializeSelectedItems(
      genres,
      genres_value,
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

  const [hasChanges, setHasChanges] = useState(false);

  const onChangeWrapper = (e) => {
    onChangeHandler(
      e,
      item_type,
      selectedItems,
      setSelectedItems,
      setGenresValue,
      setMinRatingsValue,
      setPlatformsValue,
      setPopularityFilters,
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
      ? [
          release_date,
          popularity,
          minimum_ratings,
          platforms,
          genres,
          ratings,
          seasons,
          status,
        ]
      : [release_date, popularity, minimum_ratings, genres, ratings];

  const [visible, setVisible] = useState(false);

  const toast = useRef(null);

  const accept = () => {
    if (shouldSendCustomEvents()) {
      window.beam(`/custom-events/clear_preferences_accepted`);
    }

    toast.current.show({
      severity: "info",
      summary: "Confirmation",
      detail: "Enjoy your fresh start!",
      life: 3000,
    });

    setTimeout(clearAndReload(user), 3000);
  };

  const shouldReload = (updatedAt) => {
    if (!updatedAt) return true;
    const currentTime = new Date().getTime();
    const updatedAtTime = new Date(updatedAt).getTime();
    const sixHoursInMilliseconds = 6 * 60 * 60 * 1000;
    return currentTime - updatedAtTime > sixHoursInMilliseconds;
  };

  if (isAuthenticated && shouldReload(localStorage.getItem("updated_at"))) {
    localStorage.setItem("updated_at", new Date().toISOString());
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

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
                (item.origin === "genres" && item.code === "allgenres") ||
                (item.origin === "minimum_ratings" && item.code !== "4.5") ||
                (item.origin === "platforms" && item.code === "all") ||
                (item.origin === "popularity" && item.code !== "enabled") ||
                (item.origin === "release_date" &&
                  item.code !== "new") ? null : (
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="pi pi-trash" />
            <span onClick={() => setVisible(true)}>Reset Preferences</span>
          </div>
          <Toast ref={toast} />
          <ConfirmDialog
            visible={visible}
            onHide={() => setVisible(false)}
            message="Are you sure you want to proceed?"
            header="Clear my preferences"
            accept={accept}
          />
        </div>
      </Sidebar>
    </span>
  );
};

export default SidebarFilters;
