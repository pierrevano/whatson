import { ThemeProvider } from "styled-components";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SidebarFilters from "../SidebarFilters";
import config from "../../../config";
import { createFilters } from "../createFilters";
import * as theme from "../../../theme";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    isAuthenticated: false,
    user: null,
  }),
}));

jest.mock("../initializeLocalStorage", () => jest.fn());

jest.mock("utils/analytics", () => ({
  trackAnalyticsEvent: jest.fn(),
}));

jest.mock("utils/clearLocalStorage", () => ({
  clearAndReload: jest.fn(),
}));

jest.mock("utils/getPreferences", () => ({
  getPreferences: jest.fn(() => ({ data: null, statusCode: 200 })),
}));

jest.mock("utils/postPreferences", () => jest.fn());

jest.mock("primereact/sidebar", () => {
  const React = require("react");
  return {
    Sidebar: ({ children }) =>
      React.createElement("div", { "data-testid": "sidebar" }, children),
  };
});

jest.mock("primereact/slider", () => {
  const React = require("react");
  return {
    Slider: ({ value, min, max, step, onChange, onSlideEnd }) =>
      React.createElement("input", {
        "data-testid": "runtime-slider",
        type: "range",
        min,
        max,
        step,
        value: value[1],
        onChange: (event) => {
          const nextRange = [value[0], Number(event.target.value)];
          onChange?.({ value: nextRange });
        },
        onMouseUp: (event) => {
          const nextRange = [value[0], Number(event.target.value)];
          onSlideEnd?.({ value: nextRange });
        },
      }),
  };
});

jest.mock("primereact/confirmdialog", () => {
  const React = require("react");
  return {
    ConfirmDialog: ({ visible, message }) =>
      visible
        ? React.createElement(
            "div",
            { "data-testid": "confirm-dialog" },
            message,
          )
        : null,
  };
});

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function replaceAll(searchValue, replaceValue) {
    return this.split(searchValue).join(replaceValue);
  };
}

const filters = createFilters(config);
const mustSeeToggleItem = filters.must_see.items.find(
  (item) => item.code === "true",
);

const buildPopularityGroup = () => ({
  ...filters.popularity,
  items: [
    ...filters.popularity.items.filter((item) => item.code === "enabled"),
    ...(mustSeeToggleItem ? [mustSeeToggleItem] : []),
  ],
});

const getGroupsForItemType = (itemType = "movie") => {
  const popularityGroup = buildPopularityGroup();

  if (itemType === "tvshow") {
    return [
      filters.release_date,
      popularityGroup,
      filters.minimum_ratings,
      filters.platforms,
      filters.genres,
      filters.ratings,
      filters.seasons,
      filters.status,
    ];
  }

  return [
    filters.release_date,
    popularityGroup,
    filters.minimum_ratings,
    filters.genres,
    filters.ratings,
  ];
};

const isVisibleFilterItem = (item) =>
  !(
    (item.origin === "genres" && item.code === "allgenres") ||
    (item.origin === "minimum_ratings" && item.code !== "0.0") ||
    (item.origin === "must_see" && item.code === "false") ||
    (item.origin === "platforms" && item.code === "all") ||
    (item.origin === "popularity" && item.code !== "enabled") ||
    (item.origin === "release_date" && item.code !== "new")
  );

const labelForItem = (item) => {
  if (item.name === "True") {
    return "Metacritic must-see only";
  }
  if (item.name === "Enabled") {
    return "Include major platform trends";
  }
  if (item.name === "New") {
    return "Recent items only";
  }
  return item.name;
};

const getVisibleFilterItems = (itemType) =>
  getGroupsForItemType(itemType)
    .flatMap((group) => group.items.filter(isVisibleFilterItem))
    .filter((item) => item.origin !== "minimum_ratings");

const storageKeyByOrigin = {
  genres: "genres",
  must_see: "must_see",
  platforms: "platforms",
  popularity: "popularity_filters",
  ratings: "ratings_filters",
  release_date: "release_date",
  seasons: "seasons_number",
  status: "status",
};

const splitValues = (value) =>
  (value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const visibleFilterItemsForTv = getVisibleFilterItems("tvshow");
const visibleFilterItemsForTvWithoutMustSee = visibleFilterItemsForTv.filter(
  (item) => item.origin !== "must_see",
);
const chipToggleCasesForTv = visibleFilterItemsForTvWithoutMustSee.map(
  (item) => [labelForItem(item), item],
);
const minimumRatingsItems = filters.minimum_ratings.items;
const defaultPopularityFilters = config.popularity
  .split(",")
  .filter((code) => code !== "enabled")
  .join(",");

const renderSidebar = (initialValues = {}) => {
  window.localStorage.clear();

  const defaultStorageState = {
    directors: "",
    genres: "",
    minimum_ratings: "",
    must_see: "",
    platforms: "",
    popularity_filters: defaultPopularityFilters,
    production_companies: "",
    ratings_filters: "",
    release_date: "",
    runtime: config.runtime,
    seasons_number: "",
    status: "",
    top_ranking_order: config.top_ranking_order,
    mojo_rank_order: config.mojo_rank_order,
    item_type: "",
  };

  const storageState = { ...defaultStorageState, ...initialValues };

  Object.entries(storageState).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  });

  return render(
    <ThemeProvider theme={theme}>
      <SidebarFilters />
    </ThemeProvider>,
  );
};

describe("SidebarFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it("updates genres storage when selecting a genre", () => {
    renderSidebar({
      genres: "Comedy",
    });

    const dramaChip = screen.getByRole("button", { name: "Drama" });
    expect(dramaChip).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(dramaChip);

    expect(window.localStorage.getItem("genres")).toContain("Drama");
  });

  it("stores release date preference when selecting new content", () => {
    renderSidebar({
      release_date: "",
    });

    const newOnlyChip = screen.getByRole("button", {
      name: "Recent items only",
    });
    expect(newOnlyChip).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(newOnlyChip);

    expect(window.localStorage.getItem("release_date")).toBe("new");
  });

  it("stores directors and production companies text filters", () => {
    renderSidebar();

    fireEvent.change(screen.getByRole("textbox", { name: "Directors" }), {
      target: { value: "Christopher Nolan, Greta Gerwig" },
    });
    fireEvent.change(
      screen.getByRole("textbox", { name: "Production companies" }),
      {
        target: { value: "A24, Studio Ghibli" },
      },
    );

    expect(window.localStorage.getItem("directors")).toBe(
      "Christopher Nolan, Greta Gerwig",
    );
    expect(window.localStorage.getItem("production_companies")).toBe(
      "A24, Studio Ghibli",
    );
  });

  it("stores popularity filters when enabling trends", () => {
    renderSidebar({
      popularity_filters: "",
    });

    const trendsChip = screen.getByRole("button", {
      name: /Include major platform trends/i,
    });
    expect(trendsChip).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(trendsChip);

    expect(window.localStorage.getItem("popularity_filters")).toBe(
      config.popularity
        .split(",")
        .filter((code) => code !== "enabled")
        .join(","),
    );
  });

  it("keeps the trends chip selected when popularity filters are stored without enabled", () => {
    renderSidebar({
      popularity_filters: config.popularity
        .split(",")
        .filter((code) => code !== "enabled")
        .join(","),
    });

    expect(
      screen.getByRole("button", {
        name: /Include major platform trends/i,
      }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps the trends chip selected when popularity filters are stored with the legacy enabled token", () => {
    renderSidebar({
      popularity_filters: "enabled,allocine_popularity,imdb_popularity",
    });

    expect(
      screen.getByRole("button", {
        name: /Include major platform trends/i,
      }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it.each(minimumRatingsItems.map((item) => [item.name, item.code]))(
    "renders minimum ratings selection when storage contains %s",
    (label, code) => {
      renderSidebar({ minimum_ratings: code });

      expect(screen.getByRole("button", { name: label })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    },
  );

  it("stores minimum ratings selection", () => {
    renderSidebar({
      minimum_ratings: "3.0",
    });

    expect(screen.getByRole("button", { name: "3 and more" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "4.5 and more" }));

    expect(window.localStorage.getItem("minimum_ratings")).toBe("4.5");
  });

  it("stores default minimum ratings when none set and user selects 4.5", () => {
    renderSidebar({ minimum_ratings: undefined });

    fireEvent.click(screen.getByRole("button", { name: "4.5 and more" }));

    expect(window.localStorage.getItem("minimum_ratings")).toBe("4.5");
  });

  it("stores order by preference", () => {
    renderSidebar();

    const defaultOrderChip = screen.getByRole("button", {
      name: "Default order",
    });

    expect(defaultOrderChip).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(
      screen.getByRole("button", {
        name: "IMDb top ranking (high → low)",
      }),
    );

    expect(window.localStorage.getItem("top_ranking_order")).toBe("asc");
    expect(window.localStorage.getItem("mojo_rank_order")).toBe("");

    fireEvent.click(defaultOrderChip);

    expect(defaultOrderChip).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem("top_ranking_order")).toBe("");
    expect(window.localStorage.getItem("mojo_rank_order")).toBe("");
  });

  it("commits runtime changes and supports resetting to defaults", async () => {
    renderSidebar();

    const slider = screen.getByTestId("runtime-slider");

    fireEvent.change(slider, { target: { value: "120" } });
    fireEvent.mouseUp(slider, { target: { value: "120" } });

    await waitFor(() =>
      expect(window.localStorage.getItem("runtime")).toBe("0,7200"),
    );

    const resetButton = await screen.findByText("Reset runtime");
    fireEvent.click(resetButton);

    await waitFor(() =>
      expect(window.localStorage.getItem("runtime")).toBe(""),
    );
  });

  it("initializes slider from new two-value storage format with explicit zero minimum", () => {
    renderSidebar({ runtime: "0,7200" });

    const slider = screen.getByTestId("runtime-slider");
    expect(slider).toHaveValue("120");
    expect(screen.getByText("0 min")).toBeInTheDocument();
    expect(screen.getByText("2h")).toBeInTheDocument();
    expect(screen.getByText("Reset runtime")).toBeInTheDocument();
  });

  it("parses legacy single-value runtime storage the same as the new two-value format", () => {
    renderSidebar({ runtime: "7200" });

    const slider = screen.getByTestId("runtime-slider");
    expect(slider).toHaveValue("120");
    expect(screen.getByText("0 min")).toBeInTheDocument();
    expect(screen.getByText("2h")).toBeInTheDocument();
    expect(screen.getByText("Reset runtime")).toBeInTheDocument();
  });

  it("renders only major platform trends selected by default for tv shows", () => {
    renderSidebar({ item_type: "tvshow" });

    visibleFilterItemsForTv.forEach((item) => {
      const label = labelForItem(item);
      const chip = screen.getByRole("button", { name: label });
      expect(chip).toHaveAttribute(
        "aria-pressed",
        item.origin === "popularity" ? "true" : "false",
      );
    });

    filters.minimum_ratings.items.forEach((item) => {
      expect(
        screen.getByRole("button", { name: item.name }),
      ).toBeInTheDocument();
    });
  });

  it.each(chipToggleCasesForTv)(
    "updates localStorage when toggling %s",
    (label, item) => {
      const storageKey = storageKeyByOrigin[item.origin];
      expect(storageKey).toBeDefined();

      renderSidebar({ item_type: "tvshow" });

      const chip = screen.getByRole("button", { name: label });
      expect(chip).toHaveAttribute(
        "aria-pressed",
        item.origin === "popularity" ? "true" : "false",
      );

      fireEvent.click(chip);
      const afterFirstToggle = splitValues(
        window.localStorage.getItem(storageKey),
      );
      if (item.origin === "popularity") {
        expect(afterFirstToggle).toEqual(["none"]);
      } else {
        expect(afterFirstToggle).toContain(item.code);
      }

      fireEvent.click(chip);
      const afterSecondToggle = splitValues(
        window.localStorage.getItem(storageKey),
      );
      if (item.origin === "popularity") {
        expect(afterSecondToggle).toEqual(
          config.popularity.split(",").filter((code) => code !== "enabled"),
        );
      } else {
        expect(afterSecondToggle).not.toContain(item.code);
      }
    },
  );

  it("stores genres as all when every visible genre chip is selected", () => {
    renderSidebar();

    filters.genres.items
      .filter((item) => item.code !== "allgenres")
      .forEach((item) => {
        fireEvent.click(screen.getByRole("button", { name: item.name }));
      });

    expect(window.localStorage.getItem("genres")).toBe("all");
  });

  it("stores platforms as all when every visible platform chip is selected", () => {
    renderSidebar({ item_type: "tvshow" });

    filters.platforms.items
      .filter((item) => item.code !== "all")
      .forEach((item) => {
        fireEvent.click(screen.getByRole("button", { name: item.name }));
      });

    expect(window.localStorage.getItem("platforms")).toBe("all");
  });

  it("replaces the old reset link with action buttons and opens the reset confirmation", () => {
    renderSidebar();

    expect(
      screen.getByRole("button", { name: "Apply filters" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
    expect(screen.queryByText("Reset Preferences")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();
  });

  it("toggles Metacritic must-see only chip and updates storage", () => {
    renderSidebar({ item_type: "tvshow" });

    const chip = screen.getByRole("button", {
      name: "Metacritic must-see only",
    });
    expect(chip).toHaveAttribute("aria-pressed", "false");
    expect(window.localStorage.getItem("must_see")).toBe("");

    fireEvent.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem("must_see")).toBe("true");

    fireEvent.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "false");
    expect(window.localStorage.getItem("must_see")).toBe("");
  });

  it("normalizes legacy false-only must-see storage when selecting the chip", () => {
    renderSidebar({ item_type: "tvshow", must_see: "false" });

    const chip = screen.getByRole("button", {
      name: "Metacritic must-see only",
    });

    fireEvent.click(chip);

    expect(window.localStorage.getItem("must_see")).toBe("true");
  });
});
