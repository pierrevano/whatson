import { useCallback, useState } from "react";
import { onChangeHandler } from "./onChangeHandler";

/**
 * Handles the chip selection state and storage updates for the sidebar filters.
 *
 * @param {object} params - Hook inputs.
 * @param {string} params.itemType - Current item type.
 * @param {object[]} params.selectedItems - Currently selected sidebar items.
 * @param {Function} params.setSelectedItems - React state setter for selected items.
 * @param {Function} params.setGenresValue - Local storage setter for genres.
 * @param {Function} params.setMinRatingsValue - Local storage setter for minimum ratings.
 * @param {Function} params.setMustSeeValue - Local storage setter for must-see.
 * @param {Function} params.setPlatformsValue - Local storage setter for platforms.
 * @param {Function} params.setPopularityFilters - Local storage setter for popularity filters.
 * @param {Function} params.setRatingsFilters - Local storage setter for ratings filters.
 * @param {Function} params.setReleaseDateValue - Local storage setter for release date.
 * @param {Function} params.setSeasonsNumber - Local storage setter for seasons.
 * @param {Function} params.setStatusValue - Local storage setter for status.
 * @param {Function} params.markAsChanged - Marks the sidebar as dirty.
 * @param {string} params.popularityFilters - Stored popularity filters value.
 * @param {string | null} params.currentOrderBySelection - Current order chip value.
 * @param {Function} params.handleOrderByChange - Order change handler.
 * @returns {{
 *   handleChipToggle: Function,
 *   handleMinimumRatingsChip: Function,
 *   handleOrderByChipClick: Function,
 *   isItemSelected: Function,
 *   isOrderChipSelected: Function
 * }} Sidebar chip selection API.
 */
export const useSidebarChipSelection = ({
  itemType,
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
  popularityFilters,
  currentOrderBySelection,
  handleOrderByChange,
}) => {
  const [
    hasExplicitDefaultOrderSelection,
    setHasExplicitDefaultOrderSelection,
  ] = useState(false);

  const onChangeWrapper = useCallback(
    (event) => {
      onChangeHandler(
        event,
        itemType,
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
      itemType,
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
      setSelectedItems,
      setStatusValue,
    ],
  );

  const isItemSelected = useCallback(
    (item) => {
      if (item.origin === "popularity" && item.code === "enabled") {
        return Boolean(popularityFilters) && popularityFilters !== "none";
      }

      return selectedItems.some(
        (selectedItem) =>
          selectedItem.origin === item.origin &&
          selectedItem.code === item.code,
      );
    },
    [popularityFilters, selectedItems],
  );

  const handleChipToggle = useCallback(
    (item) => {
      const active = isItemSelected(item);

      onChangeWrapper({
        target: {
          name: item.origin,
          value: item.code,
          checked: !active,
        },
      });
    },
    [isItemSelected, onChangeWrapper],
  );

  const handleMinimumRatingsChip = useCallback(
    (item) => {
      setSelectedItems((previous) => [
        ...previous.filter(
          (selectedItem) => selectedItem.origin !== "minimum_ratings",
        ),
        { origin: "minimum_ratings", code: item.code },
      ]);
      setMinRatingsValue(item.code);
      markAsChanged();
    },
    [markAsChanged, setMinRatingsValue, setSelectedItems],
  );

  const handleOrderByChipClick = useCallback(
    (nextValue) => {
      setHasExplicitDefaultOrderSelection(!nextValue);
      handleOrderByChange(nextValue || null);
    },
    [handleOrderByChange],
  );

  const isOrderChipSelected = useCallback(
    (optionValue) =>
      optionValue
        ? currentOrderBySelection === optionValue
        : !currentOrderBySelection && hasExplicitDefaultOrderSelection,
    [currentOrderBySelection, hasExplicitDefaultOrderSelection],
  );

  return {
    handleChipToggle,
    handleMinimumRatingsChip,
    handleOrderByChipClick,
    isItemSelected,
    isOrderChipSelected,
  };
};

export default useSidebarChipSelection;
