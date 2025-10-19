import { useCallback, useMemo } from "react";

export const ORDER_BY_OPTIONS = [
  {
    label: "IMDb top ranking (high \u2192 low)",
    value: "top_ranking_order:asc",
  },
  {
    label: "IMDb top ranking (low \u2192 high)",
    value: "top_ranking_order:desc",
  },
  { label: "Mojo rank (high \u2192 low)", value: "mojo_rank_order:asc" },
  { label: "Mojo rank (low \u2192 high)", value: "mojo_rank_order:desc" },
];

const normalize = (value) => value || "";

export const useOrderBySelection = ({
  topRankingOrder,
  setTopRankingOrder,
  mojoRankOrder,
  setMojoRankOrder,
  markAsChanged,
}) => {
  const currentOrderBySelection = useMemo(() => {
    if (topRankingOrder) {
      return `top_ranking_order:${topRankingOrder}`;
    }

    if (mojoRankOrder) {
      return `mojo_rank_order:${mojoRankOrder}`;
    }

    return null;
  }, [mojoRankOrder, topRankingOrder]);

  const handleOrderByChange = useCallback(
    (nextValue) => {
      const normalizedNext = normalize(nextValue);
      const normalizedCurrent = normalize(currentOrderBySelection);

      if (normalizedCurrent === normalizedNext) {
        return;
      }

      if (topRankingOrder) {
        setTopRankingOrder("");
      }

      if (mojoRankOrder) {
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

      markAsChanged?.();
    },
    [
      currentOrderBySelection,
      markAsChanged,
      mojoRankOrder,
      setMojoRankOrder,
      setTopRankingOrder,
      topRankingOrder,
    ],
  );

  return {
    orderByOptions: ORDER_BY_OPTIONS,
    currentOrderBySelection,
    handleOrderByChange,
  };
};

export default useOrderBySelection;
