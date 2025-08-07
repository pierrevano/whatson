const config = {
  // base urls information
  base: "https://api.themoviedb.org/3",
  api: process.env.REACT_APP_TMDB_KEY,

  base_render_api: process.env.REACT_APP_WHATSON_API_URL,
  base_render: "https://whatson.onrender.com",
  digest_secret_value: process.env.REACT_APP_DIGEST_SECRET_VALUE,

  base_beamanalytics: "https://beamanalytics.b-cdn.net/beam.min.js",
  beamanalytics_token: "b94aa7d4-c64e-4086-b7e3-d7d5ad700bab",

  cache_expiration_duration_milliseconds: 60000, // 1 minute
  loader_icon_duration_milliseconds: 37250,

  // filters specifics
  favorites: "",

  genres:
    "Drama,Crime,Mystery,Sci-Fi & Fantasy,Action & Adventure,Comedy,War & Politics,Family,Animation,Western,Soap,Reality,allgenres",

  item_type: "movie,tvshow",

  minimum_ratings: "4.5,4.0,3.5,3.0,2.5,2.0,1.0,0.0",
  minimum_ratings_names:
    "4.5 and more,4 and more,3.5 and more,3 and more,2.5 and more,2 and more,1 and more,0 and more",

  must_see: "false",
  must_see_names: "True,False",

  release_date: "everything,new",
  release_date_names: "Everything,New",

  platforms:
    "Canal+ Ciné Séries,Netflix,Prime Video,Max,Disney+,Paramount+,Apple TV+,Canal+,OCS,ADN,Crunchyroll,all",

  popularity: "enabled,allocine_popularity,imdb_popularity",

  ratings:
    "allocine_critics,allocine_users,betaseries_users,imdb_users,metacritic_critics,metacritic_users,rottentomatoes_critics,rottentomatoes_users,letterboxd_users,senscritique_users,tmdb_users,trakt_users,tvtime_users",
  ratings_names:
    "AlloCiné critics,AlloCiné users,BetaSeries users,IMDb users,Letterboxd users,Metacritic critics,Metacritic users,Rotten Tomatoes critics,Rotten Tomatoes users,SensCritique users,TMDB users,Trakt users,TV Time users",

  seasons: "1,2,3,4,5",
  seasons_names: "1,2,3,4,5 and more",

  status: "canceled,ended,ongoing,pilot,unknown",
};

export default config;
