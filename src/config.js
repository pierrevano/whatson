const config = {
  // base urls information
  base: "https://api.themoviedb.org/3",
  api: process.env.REACT_APP_TMDB_KEY,

  base_render_api: process.env.REACT_APP_WHATSON_API_URL,
  base_render: "https://whatson.onrender.com",

  base_beamanalytics: "https://beamanalytics.b-cdn.net/beam.min.js",
  beamanalytics_token: "b94aa7d4-c64e-4086-b7e3-d7d5ad700bab",

  cache_expiration_duration_milliseconds: 3600000,

  // filters specifics
  episodes_details: "true",

  item_type: "movie,tvshow",

  minimum_ratings: "4.5,4,3.5,3,2.5,2,1,0",
  minimum_ratings_names:
    "4.5 and more,4 and more,3.5 and more,3 and more,2.5 and more,2 and more,1 and more,0 and more",

  release_date: "everything",
  release_date_names: "New,Everything",

  platforms:
    "Canal+ Ciné Séries,Netflix,Prime Video,Canal+,TF1+,Disney+,Paramount+,Apple TV+,Pass Warner,OCS,M6+,Crunchyroll,ADN,Universal+,all",

  popularity: "allocine_popularity,imdb_popularity",
  popularity_names: "None,allocine_popularity,imdb_popularity",

  ratings:
    "allocine_critics,allocine_users,betaseries_users,imdb_users,letterboxd_users,metacritic_critics,metacritic_users,rottenTomatoes_critics,rottenTomatoes_users,senscritique_users,tmdb_users,trakt_users",
  ratings_names:
    "AlloCiné critics,AlloCiné users,BetaSeries users,IMDb users,Letterboxd users,Metacritic critics,Metacritic users,Rotten Tomatoes critics,Rotten Tomatoes users,SensCritique users,TMDB users,Trakt users",

  seasons: "1,2,3,4,5",

  status: "canceled,ended,ongoing,pilot,unknown",
};

export default config;
