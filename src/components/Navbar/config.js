const config = {
  ratingsSelector: ".ratings-filters",
  theatersSelector: ".theaters-search",
  checkMarkSelector: ".check-mark",
  crossMarkSelector: ".cross-mark",
  navbarDiv: ".navbar-div",

  item_type: "movie,tvshow",

  minimum_ratings: "4.5,4,3.5,3,2.5,2,1,0",

  release_date: "last_6_months,from_the_beginning",
  release_date_names: "Last 6 months,From the beginning",

  platforms:
    "Canal+ Ciné Séries,Netflix,Prime Video,Canal+,TF1+,Disney+,Paramount+,Apple TV+,Pass Warner,OCS,M6+,Crunchyroll,ADN,Universal+,all",

  popularity: "allocine_popularity,imdb_popularity",
  popularity_names: "AlloCiné popularity,IMDb popularity",

  ratings:
    "allocine_critics,allocine_users,betaseries_users,imdb_users,letterboxd_users,metacritic_critics,metacritic_users,rottenTomatoes_critics,rottenTomatoes_users,senscritique_users,tmdb_users,trakt_users",
  ratings_names:
    "AlloCiné critics,AlloCiné users,BetaSeries users,IMDb users,Letterboxd users,Metacritic critics,Metacritic users,Rotten Tomatoes critics,Rotten Tomatoes users,SensCritique users,TMDB users,Trakt users",

  seasons: "1,2,3,4,5",

  status: "canceled,ended,ongoing,pilot,soon,unknown",
};

export default config;
