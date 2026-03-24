import React, { useCallback, useMemo, useState } from "react";
import { clearAndReload } from "utils/clearLocalStorage";
import { ConfirmDialog } from "primereact/confirmdialog";
import { createFilters } from "./createFilters";
import { initializeSelectedItems } from "./initializeSelectedItems";
import { trackAnalyticsEvent } from "utils/analytics";
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
import {
  buildGroupedItems,
  buildPopularityGroup,
  getFilterItemLabel,
  isVisibleFilterItem,
} from "./sidebarFilterUtils";
import { useSidebarChipSelection } from "./useSidebarChipSelection";
import { useTouchEndNormalization } from "./useTouchEndNormalization";

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

const SectionStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Chip = styled.button`
  background: ${(p) =>
    p.$active ? p.theme.colors.green : p.theme.colors.grey};
  border: 1px solid
    ${(p) => (p.$active ? p.theme.colors.green : "rgb(53, 63, 76)")};
  color: ${(p) => p.theme.colors.white};
  border-radius: 999px;
  padding: ${(p) => (p.$compact ? "0.5rem 0.75rem" : "0.55rem 0.875rem")};
  cursor: pointer;
  line-height: 1.2;
  font-size: ${(p) => (p.$compact ? "0.95rem" : "1rem")};
  text-align: center;
  white-space: normal;

  &:focus {
    outline: none;
    box-shadow: ${(p) => p.theme.focusShadow};
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.25rem;
`;

const ActionButton = styled.button`
  background: ${(p) =>
    p.$variant === "primary" ? p.theme.colors.green : p.theme.colors.grey};
  color: ${(p) => p.theme.colors.white};
  border: 1px solid
    ${(p) =>
      p.$variant === "primary" ? p.theme.colors.green : "rgb(53, 63, 76)"};
  min-height: 2.8rem;
  padding: 0.65rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;

  &:focus {
    outline: none;
    box-shadow: ${(p) => p.theme.focusShadow};
  }
`;

const TextFilterInput = styled.input`
  width: 100%;
  background: ${(p) => p.theme.colors.grey};
  border: 1px solid rgb(53, 63, 76);
  color: ${(p) => p.theme.colors.white};
  border-radius: 0.25rem;
  padding: 0.75rem 0.875rem;
  font-family: inherit;
  font-size: 1rem;

  &::placeholder {
    color: ${(p) => p.theme.colors.lightGrey};
  }

  &:focus {
    outline: none;
    box-shadow: ${(p) => p.theme.focusShadow};
  }
`;

const SidebarFilters = () => {
  const { isAuthenticated, user } = useAuth0();

  initializeLocalStorage();

  const defaultItemTypeFilters = useMemo(() => config.item_type.split(","), []);

  const [directors_value, setDirectorsValue] = useStorageString(
    "directors",
    "",
  );
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
  const [production_companies_value, setProductionCompaniesValue] =
    useStorageString("production_companies", "");
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
    () => buildPopularityGroup(popularity, mustSeeToggleItem),
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
    ),
  );

  const [visibleLeftFilters, setVisibleLeftFilters] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useTouchEndNormalization();

  const markAsChanged = useCallback(() => setHasChanges(true), [setHasChanges]);

  const handleTextFilterChange = useCallback(
    (setter) => (event) => {
      setter(event.target.value);
      markAsChanged();
    },
    [markAsChanged],
  );

  const groupedItems = useMemo(
    () =>
      buildGroupedItems({
        itemType: item_type,
        defaultItemTypeFilters,
        releaseDate: release_date,
        popularityGroup,
        minimumRatings: minimum_ratings,
        platforms,
        genres,
        ratings,
        seasons,
        status,
      }),
    [
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
    ],
  );

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

  const orderByChipOptions = useMemo(
    () => [{ label: "Default order", value: "" }, ...orderByOptions],
    [orderByOptions],
  );

  const {
    handleChipToggle,
    handleMinimumRatingsChip,
    handleOrderByChipClick,
    isItemSelected,
    isOrderChipSelected,
  } = useSidebarChipSelection({
    itemType: item_type,
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
    markAsChanged,
    popularityFilters: popularity_filters,
    currentOrderBySelection,
    handleOrderByChange,
  });

  const renderFilterChips = useCallback(
    (groupedItem) => {
      if (groupedItem.name === "Minimum ratings") {
        return (
          <ChipGroup>
            {groupedItem.items.map((item) => (
              <Chip
                key={item.code}
                type="button"
                $active={isItemSelected(item)}
                aria-pressed={isItemSelected(item)}
                onClick={() => handleMinimumRatingsChip(item)}
              >
                {item.name}
              </Chip>
            ))}
          </ChipGroup>
        );
      }

      return (
        <ChipGroup>
          {groupedItem.items.filter(isVisibleFilterItem).map((item) => (
            <Chip
              key={`${groupedItem.name}-${item.code}`}
              type="button"
              $compact={groupedItem.name === "Seasons"}
              $active={isItemSelected(item)}
              aria-pressed={isItemSelected(item)}
              onClick={() => handleChipToggle(item)}
            >
              {getFilterItemLabel(item)}
            </Chip>
          ))}
        </ChipGroup>
      );
    },
    [handleChipToggle, handleMinimumRatingsChip, isItemSelected],
  );

  const handleSidebarHide = useCallback(() => {
    const runtimeChanged = commitRuntimeSelection(runtimeRangeMinutes);
    setVisibleLeftFilters(false);

    if (hasChanges || runtimeChanged) {
      setTimeout(() => window.location.reload(), 0);
    }
  }, [commitRuntimeSelection, hasChanges, runtimeRangeMinutes]);

  const accept = useCallback(() => {
    trackAnalyticsEvent("clear_preferences_accepted");

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
            <SectionStack key={`group-${groupIndex}`}>
              <h2>
                <strong>{groupedItem.name}</strong>
              </h2>
              {renderFilterChips(groupedItem)}
              {groupedItem.name === "Minimum ratings" && (
                <SectionStack>
                  <h2 style={{ marginTop: "15px" }}>
                    <strong>Order by</strong>
                  </h2>
                  <ChipGroup>
                    {orderByChipOptions.map((option) => (
                      <Chip
                        key={option.value || "default-order"}
                        type="button"
                        $active={isOrderChipSelected(option.value)}
                        aria-pressed={isOrderChipSelected(option.value)}
                        onClick={() => handleOrderByChipClick(option.value)}
                      >
                        {option.label}
                      </Chip>
                    ))}
                  </ChipGroup>
                </SectionStack>
              )}
              {groupedItem.name === "Minimum ratings" && (
                <SectionStack className="p-slider-component">
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
                </SectionStack>
              )}
              <br />
            </SectionStack>
          ))}
          <SectionStack>
            <h2>
              <strong>Directors</strong>
            </h2>
            <TextFilterInput
              type="text"
              value={directors_value}
              aria-label="Directors"
              placeholder="Christopher Nolan, Greta Gerwig"
              onChange={handleTextFilterChange(setDirectorsValue)}
            />
            <br />
          </SectionStack>
          <SectionStack>
            <h2>
              <strong>Production companies</strong>
            </h2>
            <TextFilterInput
              type="text"
              value={production_companies_value}
              aria-label="Production companies"
              placeholder="A24, Studio Ghibli"
              onChange={handleTextFilterChange(setProductionCompaniesValue)}
            />
            <br />
          </SectionStack>
          <Actions>
            <ActionButton
              type="button"
              $variant="primary"
              onClick={handleSidebarHide}
            >
              Apply filters
            </ActionButton>
            <ActionButton type="button" onClick={() => setConfirmVisible(true)}>
              Reset
            </ActionButton>
          </Actions>
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
