const config = {
  item_type: "movie,tvshow",

  minimum_ratings: "4.5,4,3.5,3,2.5,2,1,0",
  minimum_ratings_names:
    "4.5 and more,4 and more,3.5 and more,3 and more,2.5 and more,2 and more,1 and more,0 and more",

  release_date: "everything",
  release_date_names: "New,Everything",

  platforms:
    "Canal+ Ciné Séries,Netflix,Prime Video,Canal+,TF1+,Disney+,Paramount+,Apple TV+,Pass Warner,OCS,M6+,Crunchyroll,ADN,Universal+,all",

  popularity: "allocine_popularity,imdb_popularity",

  ratings:
    "allocine_critics,allocine_users,betaseries_users,imdb_users,letterboxd_users,metacritic_critics,metacritic_users,rottenTomatoes_critics,rottenTomatoes_users,senscritique_users,tmdb_users,trakt_users",
  ratings_names:
    "AlloCiné critics,AlloCiné users,BetaSeries users,IMDb users,Letterboxd users,Metacritic critics,Metacritic users,Rotten Tomatoes critics,Rotten Tomatoes users,SensCritique users,TMDB users,Trakt users",

  seasons: "1,2,3,4,5",

  status: "canceled,ended,ongoing,pilot,soon,unknown",
};

export default config;
