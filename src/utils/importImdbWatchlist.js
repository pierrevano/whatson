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
      "We could not find any titles in that watchlist. Please double-check the link.",
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
        } catch (error) {
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

const fetchWithCorsFallback = async (url) => {
  const performFetch = async (input) => {
    const response = await fetch(input, { credentials: "omit" });
    if (!response.ok) {
      throw new Error(
        "We could not load that page just now. Please try again in a moment.",
      );
    }
    return response.text();
  };

  try {
    return await performFetch(url);
  } catch (initialError) {
    const proxiedUrl = `${config.imdb_watchlist_proxy}/${url}`;

    if (url === proxiedUrl) {
      throw initialError;
    }

    try {
      return await performFetch(proxiedUrl);
    } catch (proxyError) {
      throw initialError;
    }
  }
};

const decodeHtmlEntities = (value) => {
  if (typeof window !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    return textarea.value;
  }

  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
};

const extractNextDataJson = (html) => {
  if (typeof DOMParser !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const script = doc?.getElementById?.("__NEXT_DATA__");
    const raw = script?.textContent || script?.innerHTML;

    if (!raw) {
      throw new Error(
        "We could not read any titles from that watchlist page. Please make sure it is public and try again.",
      );
    }

    return JSON.parse(raw);
  }

  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  );

  if (!match || !match[1]) {
    throw new Error(
      "We could not read any titles from that watchlist page. Please make sure it is public and try again.",
    );
  }

  const decoded = decodeHtmlEntities(match[1]);
  return JSON.parse(decoded);
};

const extractImdbIdsFromNextData = (payload) => {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const edges =
    payload?.props?.pageProps?.mainColumnData?.predefinedList
      ?.titleListItemSearch?.edges;

  const ids = [];

  if (Array.isArray(edges)) {
    edges.forEach((edge) => {
      const rawId =
        edge?.listItem?.id ||
        edge?.node?.listItem?.id ||
        edge?.node?.listItem?.title?.id;
      const normalized =
        typeof rawId === "string" && /^tt\d+$/i.test(rawId)
          ? rawId.toLowerCase()
          : null;
      if (normalized) {
        ids.push(normalized);
      }
    });
  }

  if (!ids.length) {
    const fallbackItems =
      payload?.props?.pageProps?.data?.list?.items ||
      payload?.props?.pageProps?.preloadedListData?.list?.items;

    if (Array.isArray(fallbackItems)) {
      fallbackItems.forEach((item) => {
        const rawId = item?.const || item?.id;
        const normalized =
          typeof rawId === "string" && /^tt\d+$/i.test(rawId)
            ? rawId.toLowerCase()
            : null;
        if (normalized) {
          ids.push(normalized);
        }
      });
    }
  }

  return [...new Set(ids)];
};

export const syncImdbWatchlist = async ({ url }) => {
  if (typeof url !== "string" || !url.trim()) {
    throw new Error(
      "Please enter the full link to your public IMDb watchlist.",
    );
  }

  const trimmedUrl = url.trim();
  const isValidUrl = /^https?:\/\//i.test(trimmedUrl);

  if (!isValidUrl) {
    throw new Error(
      "The watchlist link should start with http:// or https://. Please update it and try again.",
    );
  }

  const html = await fetchWithCorsFallback(trimmedUrl);
  const nextData = extractNextDataJson(html);
  const imdbIds = extractImdbIdsFromNextData(nextData);

  return resolveImdbIdsCollection(imdbIds);
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
