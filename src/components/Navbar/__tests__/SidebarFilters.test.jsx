import React from "react";
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

jest.mock("utils/shouldSendCustomEvents", () => ({
  shouldSendCustomEvents: jest.fn(() => false),
}));

jest.mock("utils/clearLocalStorage", () => ({
  clearAndReload: jest.fn(),
}));

jest.mock("utils/getPreferences", () => ({
  getPreferences: jest.fn(() => ({ data: null, statusCode: 200 })),
}));

jest.mock("utils/postPreferences", () => jest.fn());

jest.mock("primereact/checkbox", () => {
  const React = require("react");
  return {
    Checkbox: ({ inputId, name, value, checked, onChange }) =>
      React.createElement("input", {
        type: "checkbox",
        id: inputId,
        checked: !!checked,
        onChange: (event) =>
          onChange({
            target: {
              name,
              value,
              checked: event.target.checked,
            },
          }),
      }),
  };
});

jest.mock("primereact/dropdown", () => {
  const React = require("react");
  return {
    Dropdown: ({ value, options, onChange, placeholder }) =>
      React.createElement(
        "select",
        {
          "data-testid": "order-by-dropdown",
          value: value || "",
          onChange: (event) =>
            onChange({
              value: event.target.value || null,
            }),
        },
        [
          React.createElement(
            "option",
            { key: "placeholder", value: "" },
            placeholder || "Select",
          ),
          ...options.map((option) =>
            React.createElement(
              "option",
              { key: option.value, value: option.value },
              option.label,
            ),
          ),
        ],
      ),
  };
});

jest.mock("primereact/listbox", () => {
  const React = require("react");
  return {
    ListBox: ({ value, options, onChange }) =>
      React.createElement(
        "select",
        {
          "data-testid": "minimum-ratings-select",
          value: value?.code || "",
          onChange: (event) => {
            const selected = options.find(
              (option) => option.code === event.target.value,
            );
            onChange({
              target: {
                name: "minimum_ratings",
                value: selected,
                checked: true,
              },
            });
          },
        },
        options.map((option) =>
          React.createElement(
            "option",
            { key: option.code, value: option.code },
            option.name,
          ),
        ),
      ),
  };
});

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

const filters = createFilters(config);
const mustSeeToggleItem = filters.must_see.items.find(
  (item) => item.code === "false",
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

const isVisibleCheckboxItem = (item) =>
  !(
    (item.origin === "genres" && item.code === "allgenres") ||
    (item.origin === "minimum_ratings" && item.code !== "0.0") ||
    (item.origin === "must_see" && item.code !== "false") ||
    (item.origin === "platforms" && item.code === "all") ||
    (item.origin === "popularity" && item.code !== "enabled") ||
    (item.origin === "release_date" && item.code !== "new")
  );

const labelForItem = (item) => {
  if (item.name === "False") {
    return "All and Metacritic must-see";
  }
  if (item.name === "Enabled") {
    return "AlloCiné and IMDb trends";
  }
  if (item.name === "New") {
    return "New only";
  }
  return item.name;
};

const getVisibleCheckboxItems = (itemType) =>
  getGroupsForItemType(itemType)
    .flatMap((group) => group.items.filter(isVisibleCheckboxItem))
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

const visibleCheckboxItemsForTv = getVisibleCheckboxItems("tvshow");

const renderSidebar = (initialValues = {}) => {
  window.localStorage.clear();

  const defaultStorageState = {
    genres: config.genres,
    minimum_ratings: config.minimum_ratings,
    must_see: config.must_see,
    platforms: config.platforms,
    popularity_filters: config.popularity,
    ratings_filters: config.ratings,
    release_date: config.release_date,
    runtime: config.runtime,
    seasons_number: config.seasons,
    status: config.status,
    top_ranking_order: config.top_ranking_order,
    mojo_rank_order: config.mojo_rank_order,
    item_type: "",
  };

  const storageState = { ...defaultStorageState, ...initialValues };

  Object.entries(storageState).forEach(([key, value]) => {
    window.localStorage.setItem(key, value);
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

    const dramaCheckbox = screen.getByLabelText("Drama");
    expect(dramaCheckbox).not.toBeChecked();

    fireEvent.click(dramaCheckbox);

    expect(window.localStorage.getItem("genres")).toContain("Drama");
  });

  it("stores release date preference when selecting new content", () => {
    renderSidebar({
      release_date: "everything",
    });

    const newOnlyCheckbox = screen.getByLabelText("New only");
    expect(newOnlyCheckbox).not.toBeChecked();

    fireEvent.click(newOnlyCheckbox);

    expect(window.localStorage.getItem("release_date")).toBe("everything,new");
  });

  it("stores popularity filters when enabling trends", () => {
    renderSidebar({
      popularity_filters: "none",
    });

    const trendsCheckbox = screen.getByLabelText(/AlloCiné and IMDb trends/i);
    expect(trendsCheckbox).not.toBeChecked();

    fireEvent.click(trendsCheckbox);

    expect(window.localStorage.getItem("popularity_filters")).toBe(
      config.popularity,
    );
  });

  it("stores minimum ratings selection", () => {
    renderSidebar({
      minimum_ratings: "3.0",
    });

    const ratingsSelect = screen.getByTestId("minimum-ratings-select");
    expect(ratingsSelect.value).toBe("3.0");

    fireEvent.change(ratingsSelect, { target: { value: "4.5" } });

    expect(window.localStorage.getItem("minimum_ratings")).toBe("4.5");
  });

  it("stores order by preference", () => {
    renderSidebar();

    const dropdown = screen.getByTestId("order-by-dropdown");

    fireEvent.change(dropdown, {
      target: { value: "top_ranking_order:asc" },
    });

    expect(window.localStorage.getItem("top_ranking_order")).toBe("asc");
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

  it("renders all configured filters checked by default for tv shows", () => {
    renderSidebar({ item_type: "tvshow" });

    visibleCheckboxItemsForTv.forEach((item) => {
      const label = labelForItem(item);
      const checkbox = screen.getByLabelText(label);
      expect(checkbox).toBeChecked();
    });

    const ratingsSelect = screen.getByTestId("minimum-ratings-select");
    const optionLabels = Array.from(ratingsSelect.options).map(
      (option) => option.textContent,
    );
    expect(optionLabels).toEqual(
      filters.minimum_ratings.items.map((item) => item.name),
    );
  });

  it.each(visibleCheckboxItemsForTv.map((item) => [labelForItem(item), item]))(
    "updates localStorage when toggling %s",
    (label, item) => {
      const storageKey = storageKeyByOrigin[item.origin];
      expect(storageKey).toBeDefined();

      renderSidebar({ item_type: "tvshow" });

      const checkbox = screen.getByLabelText(label);
      expect(checkbox).toBeChecked();

      fireEvent.click(checkbox);
      const afterDisable = splitValues(window.localStorage.getItem(storageKey));
      expect(afterDisable).not.toContain(item.code);

      fireEvent.click(checkbox);
      const afterEnable = splitValues(window.localStorage.getItem(storageKey));
      expect(afterEnable).toContain(item.code);
    },
  );
});
