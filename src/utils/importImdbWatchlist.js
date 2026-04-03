import config from "../config";

const normalizeHeader = (header = "") =>
  header
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase();

const parseCsv = (text) => {
  const rows = [];
  let currentRow = [];
  let currentValue = "";
  let insideQuotes = false;

  const commitValue = () => {
    currentRow.push(currentValue);
    currentValue = "";
  };

  const commitRow = () => {
    commitValue();
    rows.push(currentRow);
    currentRow = [];
  };

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (insideQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          currentValue += '"';
          i += 1;
        } else {
          insideQuotes = false;
        }
      } else {
        currentValue += char;
      }
      continue;
    }

    if (char === '"') {
      insideQuotes = true;
      continue;
    }

    if (char === ",") {
      commitValue();
      continue;
    }

    if (char === "\r" || char === "\n") {
      if (char === "\r" && text[i + 1] === "\n") {
        i += 1;
      }
      commitRow();
      continue;
    }

    currentValue += char;
  }

  if (insideQuotes) {
    throw new Error(
      "The CSV appears incomplete. Please download it again from IMDb and retry.",
    );
  }

  if (currentValue !== "" || currentRow.length) {
    commitRow();
  }

  return rows.filter(
    (row) =>
      row.length > 1 ||
      (row.length === 1 && typeof row[0] === "string" && row[0].trim() !== ""),
  );
};

const extractImdbIdsFromRows = (rows) => {
  if (!rows.length) {
    return [];
  }

  const headers = rows[0].map((header) => normalizeHeader(header));
  const constIndex = headers.findIndex((header) => header === "const");

  if (constIndex === -1) {
    throw new Error(
      "We could not find the title column in that CSV. Please export the watchlist again from IMDb.",
    );
  }

  const ids = [];

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i] || [];
    const raw =
      typeof row[constIndex] === "string" ? row[constIndex].trim() : "";
    if (/^tt\d+$/i.test(raw)) {
      ids.push(raw.toLowerCase());
    }
  }

  return ids;
};

const chunkArray = (array, size) => {
  const chunks = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
};

const addFavoriteId = (favoritesSet, prefix, id) => {
  const numeric = Number(id);
  if (!Number.isFinite(numeric)) {
    return;
  }
  favoritesSet.add(`${prefix}/${Math.trunc(numeric)}`);
};

const resolveImdbIdToFavorites = async (imdbId) => {
  const endpoint = `${config.base}/find/${encodeURIComponent(imdbId)}?api_key=${config.api}&external_source=imdb_id`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(
      "We could not look up one of the titles right now. Please try again shortly.",
    );
  }

  const payload = await response.json();
  const favorites = new Set();

  if (Array.isArray(payload.movie_results)) {
    payload.movie_results.forEach((item) =>
      addFavoriteId(favorites, "movies", item?.id),
    );
  }

  if (Array.isArray(payload.tv_results)) {
    payload.tv_results.forEach((item) =>
      addFavoriteId(favorites, "tvshows", item?.id),
    );
  }

  return [...favorites];
};

const resolveImdbIdsCollection = async (imdbIds = []) => {
  if (!Array.isArray(imdbIds) || !imdbIds.length) {
    throw new Error(
      "We could not find any titles in that CSV. Please double-check the file.",
    );
  }

  const favoritesSet = new Set();
  const unmatchedIds = new Set();
  const uniqueIds = [...new Set(imdbIds)];
  const chunks = chunkArray(uniqueIds, 5);

  for (const chunk of chunks) {
    const results = await Promise.all(
      chunk.map(async (imdbId) => {
        try {
          const matches = await resolveImdbIdToFavorites(imdbId);
          if (!matches.length) {
            unmatchedIds.add(imdbId);
          }
          return matches;
        } catch {
          unmatchedIds.add(imdbId);
          return [];
        }
      }),
    );

    results.forEach((items) => items.forEach((item) => favoritesSet.add(item)));
  }

  return {
    favorites: [...favoritesSet],
    unmatched: [...unmatchedIds],
    total: uniqueIds.length,
  };
};

export const importImdbWatchlist = async ({ file }) => {
  const isBrowserFile =
    (typeof File !== "undefined" && file instanceof File) ||
    (file &&
      typeof file === "object" &&
      typeof file.name === "string" &&
      typeof file.size === "number");

  if (!isBrowserFile) {
    throw new Error(
      "Please choose the CSV file you downloaded from IMDb before importing.",
    );
  }

  const fileContent = await file.text();

  if (!fileContent.trim()) {
    throw new Error(
      "That CSV looks empty. Please download it again from IMDb and retry.",
    );
  }

  const rows = parseCsv(fileContent);

  if (!rows.length) {
    throw new Error(
      "That CSV looks empty. Please download it again from IMDb and retry.",
    );
  }

  const imdbIds = extractImdbIdsFromRows(rows);

  if (!imdbIds.length) {
    throw new Error(
      "We could not find any titles in that CSV. Please confirm you exported the right IMDb watchlist.",
    );
  }

  return resolveImdbIdsCollection(imdbIds);
};
