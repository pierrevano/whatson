/**
 * Configuration object for the application. Contains base URLs and API keys.
 * @property {string} base - The base URL for the application.
 * @property {string} api - The API key for The Movie Database (TMDB).
 * @property {string} cors_url - The URL for the CORS proxy server.
 * @property {string} base_render - The base URL for the server-side rendering API.
 * @property {string} base_render_website - The base URL for the server-side rendering website.
 */
const config = {
  base: "https://api.themoviedb.org/3",
  api: process.env.REACT_APP_TMDB_KEY,

  cors_url: "https://cors-sites-aafe82ad9d0c.fly.dev/",
  base_render: "https://whatson-api.onrender.com/",
  base_render_website: "https://whatson.onrender.com/",

  base_beamanalytics: "https://beamanalytics.b-cdn.net/beam.min.js",
  beamanalytics_token: "b94aa7d4-c64e-4086-b7e3-d7d5ad700bab",
};

export default config;
