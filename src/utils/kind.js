export const getTitleFromURL = (kind) => {
  if (kind === "movies") return "Movies";
  if (kind === "multi") return "Home";
  if (kind === "people") return "People";
  if (kind === "search") return "Search";
  if (kind === "tv") return "TV";
  return "Error";
};

export const getKindByURL = (input) => {
  if (input === "movies") return "movie";
  if (input === "people") return "person";
  if (input === "tv") return "tv";
  return "multi";
};
