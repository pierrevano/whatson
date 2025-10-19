import React, { useEffect, useState } from "react";
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
    border: 1px solid #28a745 !important;
    color: #28a745 !important;
    background: rgba(40, 167, 69, 0.12);
  }

  &.p-dropdown:not(.p-disabled).p-focus {
    border: 1px solid #28a745 !important;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
  }

  &.p-dropdown:hover,
  &.p-dropdown.p-focus {
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
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

  const defaultItemTypeFilters = config.item_type.split(",");

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
  } = createFilters(config);

  const mustSeeToggleItem = must_see.items.find(
    (item) => item.code === "false",
  );

  const popularityGroup = {
    ...popularity,
    items: [
      ...popularity.items.filter((item) => item.code === "enabled"),
      ...(mustSeeToggleItem ? [mustSeeToggleItem] : []),
    ],
  };

  const [visibleLeftFilters, setVisibleLeftFilters] = useState(false);

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

  const [hasChanges, setHasChanges] = useState(false);

  const runtimeBounds = {
    min: Number.isFinite(config.runtime_min_minutes)
      ? config.runtime_min_minutes
      : 0,
    max: Number.isFinite(config.runtime_max_minutes)
      ? config.runtime_max_minutes
      : 1000,
    step: Number.isFinite(config.runtime_step_minutes)
      ? config.runtime_step_minutes
      : 5,
  };

  const sliderMaxMinutes = Math.min(runtimeBounds.max, 5 * 60);
  const sliderMinMinutes = runtimeBounds.min;

  const getDefaultRuntimeRange = () => [sliderMinMinutes, sliderMaxMinutes];

  const formatMinutes = (minutes) => {
    const safeMinutes = Number.isFinite(minutes)
      ? Math.max(Math.round(minutes), 0)
      : 0;
    const cappedMinutes = Math.min(safeMinutes, sliderMaxMinutes);
    const hours = Math.floor(cappedMinutes / 60);
    const remainingMinutes = cappedMinutes % 60;

    if (hours === 0) {
      return `${cappedMinutes} min`;
    }

    if (remainingMinutes === 0) {
      if (hours === 5) {
        return `${hours}h and more`;
      }
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
  };

  const sanitizeRuntimeRange = (range) => {
    if (!Array.isArray(range) || range.length !== 2) {
      return getDefaultRuntimeRange();
    }
    const rawMin = Number(range[0]);
    const rawMax = Number(range[1]);
    const roundedMin = Number.isFinite(rawMin)
      ? Math.round(rawMin)
      : runtimeBounds.min;
    const roundedMax = Number.isFinite(rawMax)
      ? Math.round(rawMax)
      : runtimeBounds.max;
    const clampedMin = Math.min(
      Math.max(roundedMin, sliderMinMinutes),
      sliderMaxMinutes,
    );
    const clampedMax = Math.min(
      Math.max(roundedMax, clampedMin),
      sliderMaxMinutes,
    );
    return [clampedMin, clampedMax];
  };

  const parseRuntimeStorage = (value) => {
    if (!value) {
      return getDefaultRuntimeRange();
    }
    const [minSeconds, maxSeconds] = value.split(",").map(Number);
    const minMinutes = Number.isFinite(minSeconds)
      ? Math.round(minSeconds / 60)
      : sliderMinMinutes;
    const maxMinutes = Number.isFinite(maxSeconds)
      ? Math.round(maxSeconds / 60)
      : runtimeBounds.max;
    return sanitizeRuntimeRange([minMinutes, maxMinutes]);
  };

  const [runtimeRangeMinutes, setRuntimeRangeMinutes] = useState(() =>
    parseRuntimeStorage(runtime_value),
  );

  useEffect(() => {
    const parsedRange = parseRuntimeStorage(runtime_value);
    if (
      parsedRange[0] !== runtimeRangeMinutes[0] ||
      parsedRange[1] !== runtimeRangeMinutes[1]
    ) {
      setRuntimeRangeMinutes(parsedRange);
    }
  }, [runtime_value]);

  const commitRuntimeSelection = (value) => {
    const sanitizedRange = sanitizeRuntimeRange(value);
    setRuntimeRangeMinutes(sanitizedRange);
    const isDefaultRange =
      sanitizedRange[0] === sliderMinMinutes &&
      sanitizedRange[1] === sliderMaxMinutes;
    const maxMinutesForStorage =
      sanitizedRange[1] === sliderMaxMinutes &&
      runtimeBounds.max > sliderMaxMinutes
        ? runtimeBounds.max
        : sanitizedRange[1];
    const nextValue = isDefaultRange
      ? ""
      : `${sanitizedRange[0] * 60},${maxMinutesForStorage * 60}`;
    const hasChanged = nextValue !== runtime_value;
    if (!hasChanged) {
      return false;
    }
    setRuntimeValue(nextValue);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("runtime", nextValue);
    }
    setHasChanges(true);
    return true;
  };

  const handleRuntimeReset = () => {
    commitRuntimeSelection(getDefaultRuntimeRange());
  };

  const handleRuntimeChange = (value) => {
    setRuntimeRangeMinutes(sanitizeRuntimeRange(value));
  };

  const handleRuntimeSlideEnd = (value) => {
    commitRuntimeSelection(value);
  };

  const isRuntimeFilterActive =
    runtime_value !== "" ||
    runtimeRangeMinutes[0] !== sliderMinMinutes ||
    runtimeRangeMinutes[1] !== sliderMaxMinutes;

  const currentOrderBySelection = top_ranking_order
    ? `top_ranking_order:${top_ranking_order}`
    : mojo_rank_order
      ? `mojo_rank_order:${mojo_rank_order}`
      : null;

  const orderByOptions = [
    { label: "IMDb top ranking (high → low)", value: "top_ranking_order:asc" },
    { label: "IMDb top ranking (low → high)", value: "top_ranking_order:desc" },
    { label: "Mojo rank (high → low)", value: "mojo_rank_order:asc" },
    { label: "Mojo rank (low → high)", value: "mojo_rank_order:desc" },
  ];

  const handleOrderByChange = (nextValue) => {
    const normalizedNext = nextValue || "";
    const normalizedCurrent = currentOrderBySelection || "";

    if (normalizedCurrent === normalizedNext) {
      return;
    }

    if (top_ranking_order) {
      setTopRankingOrder("");
    }
    if (mojo_rank_order) {
      setMojoRankOrder("");
    }

    if (nextValue) {
      const [param, order] = nextValue.split(":");
      if (param === "top_ranking_order") {
        setTopRankingOrder(order);
      } else if (param === "mojo_rank_order") {
        setMojoRankOrder(order);
      }
    }

    setHasChanges(true);
  };

  const onChangeWrapper = (e) => {
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
    setHasChanges(true);
  };

  useEffect(() => {
    if (
      hasChanges ||
      (visibleLeftFilters &&
        (!localStorage.getItem("minimum_ratings") ||
          localStorage.getItem("minimum_ratings") === config.minimum_ratings))
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
          popularityGroup,
          minimum_ratings,
          platforms,
          genres,
          ratings,
          seasons,
          status,
        ]
      : [release_date, popularityGroup, minimum_ratings, genres, ratings];

  const [visible, setVisible] = useState(false);

  const accept = () => {
    if (shouldSendCustomEvents()) {
      window.beam?.(`/custom-events/clear_preferences_accepted`);
    }

    clearAndReload(isAuthenticated, user);
  };

  return (
    <span>
      <Filter
        onClick={() => setVisibleLeftFilters(true)}
        style={{ marginRight: "17px" }}
      />
      <Sidebar
        visible={visibleLeftFilters}
        onHide={() => {
          const runtimeChanged = commitRuntimeSelection(runtimeRangeMinutes);
          setVisibleLeftFilters(false);
          if (hasChanges || runtimeChanged) {
            setTimeout(() => window.location.reload(), 0);
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
                (item.origin === "minimum_ratings" && item.code !== "0.0") ||
                (item.origin === "must_see" && item.code !== "false") ||
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
                          tooltip={
                            item.origin === "must_see"
                              ? "Uncheck to show must-see only"
                              : null
                          }
                          tooltipOptions={
                            item.origin === "must_see"
                              ? { position: "bottom", showDelay: 200 }
                              : null
                          }
                        />
                        <label
                          htmlFor={`${item.code}-${itemIndex}`}
                          className="ml-2"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          {item.name === "False"
                            ? "All and Metacritic must-see"
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
                <div className="flex flex-column gap-3">
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
                    step={runtimeBounds.step}
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
            <span className="underlinedSpan" onClick={() => setVisible(true)}>
              Reset Preferences
            </span>
          </div>
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
