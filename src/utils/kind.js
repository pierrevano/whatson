export const getTitleFromURL = (kind) => {
  if (kind === "movies") return "Movies";
  if (kind === "multi") return "What's on?";
  if (kind === "people") return "People";
  if (kind === "search") return "Search";
  if (kind === "tvshows") return "TV Shows";
  return "Error";
};

export const getKindByURL = (input, source) => {
  const peopleValue = source !== "render" ? "person" : "";
  const tvshowValue = source !== "render" ? "tv" : "tvshow";

  if (input === "movies") return "movie";
  if (input === "people") return peopleValue;
  if (input === "tvshows") return tvshowValue;
  return "multi";
};
