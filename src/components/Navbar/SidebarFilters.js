import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { clearAndReload } from "utils/clearLocalStorage";
import { ConfirmDialog } from "primereact/confirmdialog";
import { createFilters } from "./createFilters";
import { Dropdown } from "primereact/dropdown";
import { initializeSelectedItems } from "./initializeSelectedItems";
import { ListBox } from "primereact/listbox";
import { onChangeHandler } from "./onChangeHandler";
import { shouldSendCustomEvents } from "utils/shouldSendCustomEvents";
import { Sidebar } from "primereact/sidebar";
import { Slider } from "primereact/slider";
import { useAuth0 } from "@auth0/auth0-react";
import { useOrderBySelection } from "./useOrderBySelection";
import { useRuntimeFilter } from "./useRuntimeFilter";
import { useStorageString } from "utils/useStorageString";
import config from "../../config";
import Filter from "components/Icon/Filter";
import initializeLocalStorage from "./initializeLocalStorage";
import styled from "styled-components";

const RuntimeSlider = styled(Slider)`
  .p-slider-range {
    background: #28a745 !important;
  }

  .p-slider-handle,
  .p-slider-handle:focus {
    border-color: #28a745 !important;
    background: #181818 !important;
  }

  .p-slider-handle:focus {
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
  }
`;

const OrderByDropdown = styled(Dropdown)`
  &.p-dropdown {
    border: 0.125rem solid rgba(40, 167, 69, 0.5) !important;
    color: #28a745 !important;
    background: rgb(24, 24, 24) !important;
  }

  &.p-dropdown span {
    font-size: 1rem !important;
  }

  &.p-dropdown:not(.p-disabled).p-focus {
    border: 0.1rem solid rgba(40, 167, 69, 0.5) !important;
    box-shadow: rgba(40, 167, 69, 0.5) 0px 0px 0px 0.1rem !important;
  }

  &.p-dropdown:hover,
  &.p-dropdown.p-focus {
    box-shadow: rgba(40, 167, 69, 0.5) 0px 0px 0px 0.1rem !important;
  }

  .p-dropdown-label,
  .p-dropdown-label.p-placeholder {
    color: ${(p) => p.theme.colors.white} !important;
    opacity: 0.87 !important;
    width: 0 !important;
  }

  .p-dropdown-trigger {
    color: #28a745 !important;
    background: ${(p) => p.theme.colors.dark} !important;
    margin-left: -0.5rem;
  }

  .p-dropdown-clear-icon {
    color: #28a745 !important;
  }

  .p-dropdown-items .p-dropdown-item.p-highlight,
  .p-dropdown-items .p-dropdown-item.p-highlight.p-focus {
    background: rgba(40, 167, 69, 0.2) !important;
    color: #28a745 !important;
  }
`;

const FullWidthListBox = styled(ListBox)`
  width: 100%;

  &.p-listbox {
    width: 100%;
  }
`;

const SidebarFilters = () => {
  const { isAuthenticated, user } = useAuth0();

  initializeLocalStorage();

  const defaultItemTypeFilters = useMemo(() => config.item_type.split(","), []);

  const [genres_value, setGenresValue] = useStorageString("genres", "");
  const [item_type] = useStorageString("item_type", "");
  const [minimum_ratings_value, setMinRatingsValue] = useStorageString(
    "minimum_ratings",
    "",
  );
  const [must_see_value, setMustSeeValue] = useStorageString("must_see", "");
  const [platforms_value, setPlatformsValue] = useStorageString(
    "platforms",
    "",
  );
  const [popularity_filters, setPopularityFilters] = useStorageString(
    "popularity_filters",
    "",
  );
  const [top_ranking_order, setTopRankingOrder] = useStorageString(
    "top_ranking_order",
    "",
  );
  const [mojo_rank_order, setMojoRankOrder] = useStorageString(
    "mojo_rank_order",
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
  const [runtime_value, setRuntimeValue] = useStorageString("runtime", "");
  const [seasons_number, setSeasonsNumber] = useStorageString(
    "seasons_number",
    "",
  );
  const [status_value, setStatusValue] = useStorageString("status", "");

  const filters = useMemo(() => createFilters(config), []);

  const {
    genres,
    minimum_ratings,
    must_see,
    platforms,
    popularity,
    ratings,
    release_date,
    seasons,
    status,
  } = filters;

  const mustSeeToggleItem = useMemo(
    () => must_see.items.find((item) => item.code === "true"),
    [must_see.items],
  );

  const popularityGroup = useMemo(
    () => ({
      ...popularity,
      items: [
        ...popularity.items.filter((item) => item.code === "enabled"),
        ...(mustSeeToggleItem ? [mustSeeToggleItem] : []),
      ],
    }),
    [mustSeeToggleItem, popularity],
  );

  const [selectedItems, setSelectedItems] = useState(() =>
    initializeSelectedItems(
      genres,
      genres_value,
      minimum_ratings,
      minimum_ratings_value,
      must_see,
      must_see_value,
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

  const [visibleLeftFilters, setVisibleLeftFilters] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const markAsChanged = useCallback(() => setHasChanges(true), [setHasChanges]);

  const groupedItems = useMemo(() => {
    if (item_type && item_type === defaultItemTypeFilters[1]) {
      return [
        release_date,
        popularityGroup,
        minimum_ratings,
        platforms,
        genres,
        ratings,
        seasons,
        status,
      ];
    }

    return [release_date, popularityGroup, minimum_ratings, genres, ratings];
  }, [
    defaultItemTypeFilters,
    genres,
    item_type,
    minimum_ratings,
    platforms,
    popularityGroup,
    ratings,
    release_date,
    seasons,
    status,
  ]);

  const {
    runtimeRangeMinutes,
    sliderMinMinutes,
    sliderMaxMinutes,
    sliderStep,
    formatMinutes,
    handleRuntimeChange,
    handleRuntimeSlideEnd,
    handleRuntimeReset,
    commitRuntimeSelection,
    isRuntimeFilterActive,
  } = useRuntimeFilter({
    config,
    runtimeValue: runtime_value,
    setRuntimeValue,
    markAsChanged,
  });

  const { orderByOptions, currentOrderBySelection, handleOrderByChange } =
    useOrderBySelection({
      topRankingOrder: top_ranking_order,
      setTopRankingOrder,
      mojoRankOrder: mojo_rank_order,
      setMojoRankOrder,
      markAsChanged,
    });

  const onChangeWrapper = useCallback(
    (e) => {
      onChangeHandler(
        e,
        item_type,
        selectedItems,
        setSelectedItems,
        setGenresValue,
        setMinRatingsValue,
        setMustSeeValue,
        setPlatformsValue,
        setPopularityFilters,
        setRatingsFilters,
        setReleaseDateValue,
        setSeasonsNumber,
        setStatusValue,
      );
      markAsChanged();
    },
    [
      item_type,
      markAsChanged,
      selectedItems,
      setGenresValue,
      setMinRatingsValue,
      setMustSeeValue,
      setPlatformsValue,
      setPopularityFilters,
      setRatingsFilters,
      setReleaseDateValue,
      setSeasonsNumber,
      setStatusValue,
    ],
  );

  useEffect(() => {
    if (
      hasChanges ||
      (visibleLeftFilters &&
        (!localStorage.getItem("minimum_ratings") ||
          localStorage.getItem("minimum_ratings") === config.minimum_ratings))
    ) {
      const timeout = setTimeout(() => {
        const listItems = document.querySelectorAll(
          ".p-listbox-list .p-highlight",
        );

        if (listItems) {
          listItems.forEach((item) => item.classList.remove("p-highlight"));
        }
      }, 100);

      return () => clearTimeout(timeout);
    }

    return undefined;
  }, [config.minimum_ratings, hasChanges, visibleLeftFilters]);

  const handleSidebarHide = useCallback(() => {
    const runtimeChanged = commitRuntimeSelection(runtimeRangeMinutes);
    setVisibleLeftFilters(false);

    if (hasChanges || runtimeChanged) {
      setTimeout(() => window.location.reload(), 0);
    }
  }, [commitRuntimeSelection, hasChanges, runtimeRangeMinutes]);

  const accept = useCallback(() => {
    if (shouldSendCustomEvents()) {
      window.beam?.(`/custom-events/clear_preferences_accepted`);
    }

    clearAndReload(isAuthenticated, user);
  }, [isAuthenticated, user]);

  return (
    <span>
      <Filter
        onClick={() => setVisibleLeftFilters(true)}
        style={{ marginRight: "17px" }}
      />
      <Sidebar visible={visibleLeftFilters} onHide={handleSidebarHide}>
        <div className="card">
          {groupedItems.map((groupedItem, groupIndex) => (
            <div key={`group-${groupIndex}`} className="flex flex-column gap-3">
              <h2>
                <strong>{groupedItem.name}</strong>
              </h2>
              {groupedItem.items.map((item, itemIndex) =>
                (item.origin === "genres" && item.code === "allgenres") ||
                (item.origin === "minimum_ratings" && item.code !== "0.0") ||
                (item.origin === "must_see" && item.code === "false") ||
                (item.origin === "platforms" && item.code === "all") ||
                (item.origin === "popularity" && item.code !== "enabled") ||
                (item.origin === "release_date" &&
                  item.code !== "new") ? null : (
                  <div
                    key={`${groupedItem.name}-${itemIndex}`}
                    className="flex align-items-center"
                  >
                    {item.origin === "minimum_ratings" ? (
                      <FullWidthListBox
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
                        />
                        <label
                          htmlFor={`${item.code}-${itemIndex}`}
                          className="ml-2"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          {item.name === "True"
                            ? "Metacritic must-see only"
                            : item.name === "Enabled"
                              ? "AlloCiné and IMDb trends"
                              : item.name === "New"
                                ? "New only"
                                : item.name}
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
              {groupedItem.name === "Minimum ratings" && (
                <div className="flex flex-column gap-3">
                  <h2 style={{ marginTop: "15px" }}>
                    <strong>Order by</strong>
                  </h2>
                  <OrderByDropdown
                    value={currentOrderBySelection}
                    options={orderByOptions}
                    onChange={(e) => handleOrderByChange(e.value)}
                    placeholder="Default order"
                    showClear
                  />
                </div>
              )}
              {groupedItem.name === "Minimum ratings" && (
                <div className="flex flex-column gap-3 p-slider-component">
                  <h2 style={{ marginTop: "15px" }}>
                    <strong>Runtime</strong>
                  </h2>
                  <div
                    className="flex align-items-center justify-content-between"
                    style={{ marginRight: "7px" }}
                  >
                    <span>{formatMinutes(runtimeRangeMinutes[0])}</span>
                    <span>{formatMinutes(runtimeRangeMinutes[1])}</span>
                  </div>
                  <RuntimeSlider
                    value={runtimeRangeMinutes}
                    min={sliderMinMinutes}
                    max={sliderMaxMinutes}
                    step={sliderStep}
                    range
                    onChange={(e) => handleRuntimeChange(e.value)}
                    onSlideEnd={(e) => handleRuntimeSlideEnd(e.value)}
                    style={{
                      margin: "0 15px 0 7px",
                      background: "rgba(255, 255, 255, 0.5)",
                    }}
                  />
                  {isRuntimeFilterActive && (
                    <span
                      onClick={handleRuntimeReset}
                      style={{
                        cursor: "pointer",
                        alignSelf: "flex-end",
                        fontSize: "0.9rem",
                      }}
                    >
                      Reset runtime
                    </span>
                  )}
                </div>
              )}
              <br />
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="pi pi-trash" />
            <span
              className="underlinedSpan"
              onClick={() => setConfirmVisible(true)}
            >
              Reset Preferences
            </span>
          </div>
          <ConfirmDialog
            visible={confirmVisible}
            onHide={() => setConfirmVisible(false)}
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
