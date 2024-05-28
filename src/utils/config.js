const config = {
  base: "https://api.themoviedb.org/3",
  api: process.env.REACT_APP_TMDB_KEY,

  cors_url: "https://cors-sites-aafe82ad9d0c.fly.dev",
  base_render_api: process.env.WHATSON_API_URL,
  base_render: "https://whatson.onrender.com",

  base_beamanalytics: "https://beamanalytics.b-cdn.net/beam.min.js",
  beamanalytics_token: "b94aa7d4-c64e-4086-b7e3-d7d5ad700bab",
};

export default config;
