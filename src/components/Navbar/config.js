const config = {
  ratingsSelector: ".ratings-filters",
  theatersSelector: ".theaters-search",
  checkMarkSelector: ".check-mark",
  crossMarkSelector: ".cross-mark",
  navbarDiv: ".navbar-div",

  popularity: "allocine_popularity,imdb_popularity",
  ratings: "allocine_critics,allocine_users,betaseries_users,imdb_users,letterboxd_users,metacritic_critics,metacritic_users,rottenTomatoes_critics,rottenTomatoes_users,senscritique_users",
  minimum_ratings: "0,1,2,2.5,3,3.5,4,4.5",
  seasons: "1,2,3,4,5",
  status: "canceled,ended,ongoing,pilot,soon,unknown",
};

export default config;
