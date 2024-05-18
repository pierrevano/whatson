const configSelectors = {
  checkMarkSelector: ".check-mark",
  crossMarkSelector: ".cross-mark",
  menuSelector: ".menu-icon",
  navbarDiv: ".navbar-div",
  ratingsSelector: ".ratings-filters",
  theatersSelector: ".theaters-search",
};

const checkMarkSelector = configSelectors.checkMarkSelector;
const crossMarkSelector = configSelectors.crossMarkSelector;
const menuSelector = configSelectors.menuSelector;
const navbarDiv = configSelectors.navbarDiv;
const ratingsSelector = configSelectors.ratingsSelector;
const theatersSelector = configSelectors.theatersSelector;

/**
 * Toggles the display of either the ratings or theaters in the navbar.
 * @param {string} notSelector - The CSS selector for the element(s) to exclude from the toggle.
 * @returns None
 */
const displayRatingsOrTheaters = (notSelector) => {
  const navbarDivSelectors = `${navbarDiv} > *:not(${notSelector}):not(${checkMarkSelector}), ${menuSelector}`;
  const navbarDivElements = document.querySelectorAll(navbarDivSelectors);
  const flexGrowElement = document.querySelector(navbarDiv);
  navbarDivElements.forEach((element) => {
    element.classList.toggle("display-none");
  });
  flexGrowElement.classList.toggle("flex-grow");
};

/**
 * Cancels the current action and removes any filters or search bars that are currently displayed.
 * @returns None
 */
const cancel = () => {
  const ratingsFilters = document.querySelector(ratingsSelector);
  const theatersSearch = document.querySelector(theatersSelector);

  const ratingsAndCrossSelector = `${ratingsSelector},${crossMarkSelector}`;
  const theatersAndCrossSelector = `${theatersSelector},${crossMarkSelector}`;
  const ratingsFiltersAndCross = document.querySelectorAll(
    ratingsAndCrossSelector,
  );
  const theatersSearchAndCross = document.querySelectorAll(
    theatersAndCrossSelector,
  );

  const removeClasses = (notSelector) => {
    const navbarDivSelectors = `${navbarDiv} > *:not(${notSelector}):not(${checkMarkSelector}), ${menuSelector}`;
    const navbarDivElements = document.querySelectorAll(navbarDivSelectors);
    navbarDivElements.forEach((element) => {
      element.classList.remove("display-none");
    });
    const flexGrowElement = document.querySelector(navbarDiv);
    flexGrowElement.classList.remove("flex-grow");
  };

  if (ratingsFilters.classList.contains("display-none")) {
    removeClasses(ratingsSelector);
    theatersSearchAndCross.forEach((element) => {
      element.classList.add("display-none");
    });
  }
  if (theatersSearch.classList.contains("display-none")) {
    removeClasses(theatersSelector);
    ratingsFiltersAndCross.forEach((element) => {
      element.classList.add("display-none");
    });
  }
};

export { displayRatingsOrTheaters, cancel };
