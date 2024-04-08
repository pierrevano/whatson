const config = {
  ratingsSelector: ".ratings-filters",
  theatersSelector: ".theaters-search",
  checkMarkSelector: ".check-mark",
  crossMarkSelector: ".cross-mark",
  navbarDiv: ".navbar-div",

  item_type: "movie,tvshow",

  popularity: "allocine_popularity,imdb_popularity",
  popularity_names: "AlloCiné popularity,IMDb popularity",

  ratings: "allocine_critics,allocine_users,betaseries_users,imdb_users,letterboxd_users,metacritic_critics,metacritic_users,rottenTomatoes_critics,rottenTomatoes_users,senscritique_users,trakt_users",
  ratings_names: "AlloCiné critics,AlloCiné users,BetaSeries users,IMDb users,Letterboxd users,Metacritic critics,Metacritic users,Rotten Tomatoes critics,Rotten Tomatoes users,SensCritique users,Trakt users",

  minimum_ratings: "4.5,4,3.5,3,2.5,2,1,0",

  seasons: "1,2,3,4,5",

  status: "canceled,ended,ongoing,pilot,soon,unknown",
};

export default config;
