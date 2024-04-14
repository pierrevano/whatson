export const getTitleFromURL = (kind) => {
  if (kind === "movies") return "Movies";
  if (kind === "multi") return "What's on?";
  if (kind === "people") return "People";
  if (kind === "search") return "Search";
  if (kind === "tvshows") return "TV Shows";
  return "Error";
};

export const getKindByURL = (input, source) => {
  const tvshowValue = source === "render" ? "tvshow" : "tv";

  if (input === "movies") return "movie";
  if (input === "people") return "person";
  if (input === "tvshows") return tvshowValue;
  return "multi";
};
