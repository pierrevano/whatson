import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_MAX_SLIDER_MINUTES = 5 * 60;

const createBounds = (config) => ({
  min: Number.isFinite(config.runtime_min_minutes)
    ? config.runtime_min_minutes
    : 0,
  max: Number.isFinite(config.runtime_max_minutes)
    ? config.runtime_max_minutes
    : 1000,
  step: Number.isFinite(config.runtime_step_minutes)
    ? config.runtime_step_minutes
    : 5,
});

const areRangesEqual = (left, right) =>
  Array.isArray(left) &&
  Array.isArray(right) &&
  left.length === right.length &&
  left.every((value, index) => value === right[index]);

export const useRuntimeFilter = ({
  config,
  runtimeValue,
  setRuntimeValue,
  markAsChanged,
}) => {
  const bounds = useMemo(
    () => createBounds(config),
    [
      config.runtime_min_minutes,
      config.runtime_max_minutes,
      config.runtime_step_minutes,
    ],
  );

  const sliderMinMinutes = bounds.min;
  const sliderMaxMinutes = useMemo(
    () => Math.min(bounds.max, DEFAULT_MAX_SLIDER_MINUTES),
    [bounds.max],
  );

  const getDefaultRuntimeRange = useCallback(
    () => [sliderMinMinutes, sliderMaxMinutes],
    [sliderMinMinutes, sliderMaxMinutes],
  );

  const sanitizeRuntimeRange = useCallback(
    (range) => {
      if (!Array.isArray(range) || range.length !== 2) {
        return getDefaultRuntimeRange();
      }

      const rawMin = Number(range[0]);
      const rawMax = Number(range[1]);
      const roundedMin = Number.isFinite(rawMin)
        ? Math.round(rawMin)
        : sliderMinMinutes;
      const roundedMax = Number.isFinite(rawMax)
        ? Math.round(rawMax)
        : bounds.max;

      const clampedMin = Math.min(
        Math.max(roundedMin, sliderMinMinutes),
        sliderMaxMinutes,
      );
      const clampedMax = Math.min(
        Math.max(roundedMax, clampedMin),
        sliderMaxMinutes,
      );

      return [clampedMin, clampedMax];
    },
    [bounds.max, getDefaultRuntimeRange, sliderMaxMinutes, sliderMinMinutes],
  );

  const parseRuntimeStorage = useCallback(
    (value) => {
      if (!value) {
        return getDefaultRuntimeRange();
      }

      const [minSeconds, maxSeconds] = value.split(",").map(Number);
      const minMinutes = Number.isFinite(minSeconds)
        ? Math.round(minSeconds / 60)
        : sliderMinMinutes;
      const maxMinutes = Number.isFinite(maxSeconds)
        ? Math.round(maxSeconds / 60)
        : bounds.max;

      return sanitizeRuntimeRange([minMinutes, maxMinutes]);
    },
    [
      bounds.max,
      getDefaultRuntimeRange,
      sanitizeRuntimeRange,
      sliderMinMinutes,
    ],
  );

  const [runtimeRangeMinutes, setRuntimeRangeMinutes] = useState(() =>
    parseRuntimeStorage(runtimeValue),
  );

  useEffect(() => {
    const parsedRange = parseRuntimeStorage(runtimeValue);

    setRuntimeRangeMinutes((currentRange) =>
      areRangesEqual(parsedRange, currentRange) ? currentRange : parsedRange,
    );
  }, [parseRuntimeStorage, runtimeValue]);

  const formatMinutes = useCallback(
    (minutes) => {
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
        if (hours === DEFAULT_MAX_SLIDER_MINUTES / 60) {
          return `${hours}h and more`;
        }
        return `${hours}h`;
      }

      return `${hours}h ${remainingMinutes}m`;
    },
    [sliderMaxMinutes],
  );

  const commitRuntimeSelection = useCallback(
    (value) => {
      const sanitizedRange = sanitizeRuntimeRange(value);
      setRuntimeRangeMinutes(sanitizedRange);

      const isDefaultRange =
        sanitizedRange[0] === sliderMinMinutes &&
        sanitizedRange[1] === sliderMaxMinutes;

      const maxMinutesForStorage =
        sanitizedRange[1] === sliderMaxMinutes && bounds.max > sliderMaxMinutes
          ? bounds.max
          : sanitizedRange[1];

      const nextValue = isDefaultRange
        ? ""
        : `${sanitizedRange[0] * 60},${maxMinutesForStorage * 60}`;
      const hasChanged = nextValue !== runtimeValue;

      if (!hasChanged) {
        return false;
      }

      setRuntimeValue(nextValue);

      if (typeof window !== "undefined") {
        window.localStorage.setItem("runtime", nextValue);
      }

      markAsChanged?.();
      return true;
    },
    [
      bounds.max,
      markAsChanged,
      runtimeValue,
      sanitizeRuntimeRange,
      setRuntimeValue,
      sliderMaxMinutes,
      sliderMinMinutes,
    ],
  );

  const handleRuntimeChange = useCallback(
    (value) => {
      setRuntimeRangeMinutes(sanitizeRuntimeRange(value));
    },
    [sanitizeRuntimeRange],
  );

  const handleRuntimeSlideEnd = useCallback(
    (value) => {
      commitRuntimeSelection(value);
    },
    [commitRuntimeSelection],
  );

  const handleRuntimeReset = useCallback(() => {
    commitRuntimeSelection(getDefaultRuntimeRange());
  }, [commitRuntimeSelection, getDefaultRuntimeRange]);

  const isRuntimeFilterActive =
    runtimeValue !== "" ||
    runtimeRangeMinutes[0] !== sliderMinMinutes ||
    runtimeRangeMinutes[1] !== sliderMaxMinutes;

  return {
    runtimeRangeMinutes,
    sliderMinMinutes,
    sliderMaxMinutes,
    sliderStep: bounds.step,
    formatMinutes,
    handleRuntimeChange,
    handleRuntimeSlideEnd,
    handleRuntimeReset,
    commitRuntimeSelection,
    isRuntimeFilterActive,
    sanitizeRuntimeRange,
    getDefaultRuntimeRange,
  };
};

export default useRuntimeFilter;
