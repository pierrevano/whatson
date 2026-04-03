import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { HeartBreak } from "components/Icon";
import { importImdbWatchlist } from "utils/importImdbWatchlist";
import { Row, Cell } from "griding";
import { trackAnalyticsEvent } from "utils/analytics";
import { useFavorites } from "utils/favorites";
import Container from "components/Container";
import FetchCard from "components/Card/FetchCard";
import InfoScreen from "components/InfoScreen";
import styled from "styled-components";
import Text from "components/Text";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: 0.2s all;
`;

const ActionsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  margin: 1.5rem 0 2rem;
`;

const ActionLabel = styled(Text)`
  color: ${(p) => p.theme.colors.lightGrey};
  flex: 0 0 auto;
  white-space: nowrap;
  margin-right: 0.25rem;

  @media (max-width: 640px) {
    flex: 0 0 100%;
    margin-right: 0;
  }
`;

const ActionsGroup = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.75rem;
  flex: 0 0 auto;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
  }
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
  border: 1px solid ${(p) => p.theme.colors.midGrey};
  background: ${(p) => p.theme.colors.grey};
  color: ${(p) => p.theme.colors.white};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition:
    border 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: ${(p) => p.theme.colors.green};
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.125rem rgba(40, 167, 69, 0.35);
  }
`;

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 28rem;
`;

const ImportForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FileInput = styled.input.attrs({ type: "file" })`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${(p) => p.theme.colors.midGrey};
  background: ${(p) => p.theme.colors.grey};
  color: ${(p) => p.theme.colors.white};
  font-size: 1rem;
  font-family: inherit;
  transition:
    border 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: ${(p) => p.theme.colors.lightGrey};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.green};
    box-shadow: 0 0 0 0.125rem rgba(40, 167, 69, 0.35);
  }
  padding: 0.65rem 0.75rem;

  &::file-selector-button {
    margin-right: 1rem;
    border: none;
    border-radius: 0.5rem;
    background: ${(p) => p.theme.colors.green};
    color: ${(p) => p.theme.colors.white};
    padding: 0.45rem 0.9rem;
    font-weight: 600;
    cursor: pointer;
  }

  &:disabled::file-selector-button {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:not(:focus) {
    box-shadow: none;
  }
`;

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${(p) => p.theme.colors.green};
  background: ${(p) => p.theme.colors.green};
  color: ${(p) => p.theme.colors.white};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.125rem rgba(40, 167, 69, 0.35);
  }

  &:not(:disabled):active {
    transform: translateY(1px);
  }
`;

const StatusMessage = styled(Text)`
  margin-top: 0.5rem;
  color: ${(p) => {
    if (p.$tone === "error") {
      return p.theme.colors.red;
    }
    if (p.$tone === "success") {
      return p.theme.colors.green;
    }
    return p.theme.colors.lightGrey;
  }};
`;

const Note = styled(Text)`
  margin-top: 0.5rem;
  color: ${(p) => p.theme.colors.lightGrey};

  a {
    color: ${(p) => p.theme.colors.white};
    opacity: 0.65;
    overflow-wrap: anywhere;
    word-break: break-word;
  }
`;

const getTitle = (length) =>
  `${
    !length
      ? "no favorites"
      : `${length} ${length > 1 ? `favorites` : `favorite`}`
  }`;

const defaultImportState = { status: "idle", message: "", tone: "info" };

const csvMessages = {
  successSuffix: "from the CSV file.",
  duplicateMessage:
    "Everything from this CSV file is already in your favorites.",
  emptyMessage: "No matching titles were found in this CSV file.",
};

/**
 * A functional component that displays a list of favorite movies, tvshows, or people.
 * @returns A JSX element that displays the list of favorites.
 */
const SearchView = () => {
  const [favoritesSet, favoritesActions] = useFavorites();
  const favorites = [...favoritesSet];
  const [csvImportState, setCsvImportState] = useState(defaultImportState);
  const [csvFile, setCsvFile] = useState(null);
  const csvInputRef = useRef(null);
  const isCsvLoading = csvImportState.status === "loading";
  const [isCsvDialogOpen, setIsCsvDialogOpen] = useState(false);

  const toFriendlyMessage = (message, fallback) => {
    if (typeof message === "string" && message.trim()) {
      if (/failed to fetch/i.test(message)) {
        return "Something went wrong. Please try again shortly.";
      }
      return message;
    }
    return fallback;
  };

  const buildImportFeedback = ({
    added,
    matchedCount,
    unmatchedIds,
    totalImported,
    messages = {},
  }) => {
    const {
      successSuffix = ".",
      duplicateMessage = "Everything from this source is already in your favorites.",
      emptyMessage = "No matching titles were found in this source.",
    } = messages;

    let tone = "info";
    let status = "success";
    let messageContent;

    if (added > 0) {
      tone = "success";
      let suffix = successSuffix;

      if (!suffix) {
        suffix = ".";
      } else if (!suffix.startsWith(" ") && !/^[.,!?]/.test(suffix)) {
        suffix = ` ${suffix}`;
      }

      messageContent = `Imported ${added} new favorite${
        added > 1 ? "s" : ""
      }${suffix}`.trim();
    } else if (matchedCount > 0) {
      tone = "info";
      messageContent = duplicateMessage;
    } else {
      tone = "error";
      status = "error";
      messageContent = emptyMessage;
    }

    const safeUnmatched = Array.isArray(unmatchedIds)
      ? unmatchedIds.filter(Boolean)
      : [];

    if (safeUnmatched.length) {
      const totalNote =
        typeof totalImported === "number" && totalImported > 0
          ? ` (${safeUnmatched.length} of ${totalImported})`
          : "";

      return {
        status,
        tone,
        message: (
          <>
            {messageContent} We could not match {safeUnmatched.length} title
            {safeUnmatched.length > 1 ? "s" : ""}
            {totalNote} on TMDB. Missing IMDb IDs:{" "}
            {safeUnmatched.map((id, index) => (
              <React.Fragment key={id}>
                {index > 0 ? ", " : ""}
                <a
                  href={`https://www.imdb.com/title/${id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {id}
                </a>
              </React.Fragment>
            ))}
            .
          </>
        ),
      };
    }

    return { status, tone, message: messageContent };
  };

  const addFavoritesFromPayload = (items) => {
    if (!items) {
      return 0;
    }

    const normalized = Array.isArray(items)
      ? items
          .map((item) =>
            typeof item === "string" || typeof item === "number"
              ? `${item}`.trim()
              : "",
          )
          .filter(Boolean)
      : [];

    if (!normalized.length) {
      return 0;
    }

    const existing = new Set(favoritesSet);
    const uniqueNew = normalized.filter((item) => !existing.has(item));

    if (!uniqueNew.length) {
      return 0;
    }

    favoritesActions.addMany(uniqueNew);
    return uniqueNew.length;
  };

  const openCsvDialog = () => {
    setCsvImportState(defaultImportState);
    setCsvFile(null);
    if (csvInputRef.current) {
      csvInputRef.current.value = "";
    }
    setIsCsvDialogOpen(true);
  };

  const closeCsvDialog = () => {
    setIsCsvDialogOpen(false);
    setCsvImportState(defaultImportState);
    setCsvFile(null);
    if (csvInputRef.current) {
      csvInputRef.current.value = "";
    }
  };

  const handleCsvSubmit = async (event) => {
    event.preventDefault();

    if (!csvFile) {
      setCsvImportState({
        status: "error",
        tone: "error",
        message:
          "Please choose the CSV file you exported from IMDb before importing.",
      });
      return;
    }

    const hasCsvExtension = /\.csv$/i.test(csvFile.name || "");

    if (!hasCsvExtension) {
      setCsvImportState({
        status: "error",
        tone: "error",
        message:
          "That file does not look like the IMDb CSV export. Please pick the CSV you downloaded from IMDb.",
      });
      return;
    }

    setCsvImportState({ status: "loading", tone: "info", message: "" });

    try {
      const response = await importImdbWatchlist({
        file: csvFile,
      });
      const importedFavorites = Array.isArray(response?.favorites)
        ? response.favorites
        : [];
      const unmatchedIds = Array.isArray(response?.unmatched)
        ? response.unmatched
            .map((id) => (typeof id === "string" ? id.trim() : ""))
            .filter(Boolean)
        : [];
      const totalImported =
        typeof response?.total === "number" ? response.total : null;
      const added = addFavoritesFromPayload(importedFavorites);
      const matchedCount = importedFavorites.length;
      const feedback = buildImportFeedback({
        added,
        matchedCount,
        unmatchedIds,
        totalImported,
        messages: csvMessages,
      });

      setCsvImportState(feedback);
      if (csvInputRef.current) {
        csvInputRef.current.value = "";
      }
      setCsvFile(null);
    } catch (error) {
      setCsvImportState({
        status: "error",
        tone: "error",
        message: toFriendlyMessage(
          error?.message,
          "Sorry, we could not process that CSV right now. Please try again in a moment.",
        ),
      });
    }
  };

  const handleCsvChange = (event) => {
    const file = event?.target?.files?.[0];
    setCsvFile(file || null);
    setCsvImportState(defaultImportState);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }, 100);
    }
  }, []);

  useEffect(() => {
    trackAnalyticsEvent("favorites_view_opened");

    document.title = "Favorites - " + getTitle(favorites.length);
  }, [favorites.length]);

  return (
    <Wrapper>
      <Container>
        <ActionsBar>
          <ActionLabel weight={500} xs={0}>
            Import your IMDb watchlist:
          </ActionLabel>
          <ActionsGroup>
            <ActionButton type="button" onClick={openCsvDialog}>
              Import CSV
            </ActionButton>
          </ActionsGroup>
        </ActionsBar>
        <Dialog
          header="Import your IMDb watchlist"
          visible={isCsvDialogOpen}
          onHide={closeCsvDialog}
          style={{ width: "32rem", maxWidth: "90vw" }}
        >
          <DialogContent>
            <Note xs={0} weight={400}>
              Open your IMDb watchlist at{" "}
              <a
                href="https://www.imdb.com/list/watchlist"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.imdb.com/list/watchlist
              </a>
              , then download the CSV export from{" "}
              <a
                href="https://www.imdb.com/exports"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.imdb.com/exports
              </a>
              . We only add entries that are not already in your favorites.
            </Note>
            <ImportForm onSubmit={handleCsvSubmit}>
              <FileInput
                ref={csvInputRef}
                accept=".csv,text/csv"
                onChange={handleCsvChange}
                disabled={isCsvLoading}
              />
              <SubmitButton type="submit" disabled={isCsvLoading}>
                {isCsvLoading ? "Importing..." : "Import CSV"}
              </SubmitButton>
            </ImportForm>
            {csvImportState.message ? (
              <StatusMessage xs={0} weight={400} $tone={csvImportState.tone}>
                {csvImportState.message}
              </StatusMessage>
            ) : null}
            <Note xs={0} weight={400}>
              We try to match everything with TMDB. Titles we cannot resolve
              remain unchanged.
            </Note>
          </DialogContent>
        </Dialog>
        {!favorites.length ? (
          <InfoScreen
            emoji={<HeartBreak size={96} style={{ margin: "1rem" }} />}
            title="You do not have any favorites yet"
            description="Add movies, tvshows, or people with the ♥ button, or import your IMDb watchlist above."
          />
        ) : (
          <Fragment>
            <Text weight={600} xs={2} sm={3} md={4} xg={5}>
              {getTitle(favorites.length)}
            </Text>
            <Row
              vertical-gutter
              style={{ marginTop: "2rem", marginBottom: "2rem" }}
            >
              {favorites.map((favorite) => (
                <Cell key={favorite} xs={6} sm={4} md={3} xg={2}>
                  <FetchCard
                    kindURL={favorite?.split("/")[0]}
                    id={favorite?.split("/")[1]}
                  />
                </Cell>
              ))}
            </Row>
          </Fragment>
        )}
      </Container>
    </Wrapper>
  );
};

export default SearchView;
