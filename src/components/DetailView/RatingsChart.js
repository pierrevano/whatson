import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { useFetch } from "react-hooks-fetch";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import config from "../../config";
import * as theme from "../../theme";
import { shouldSendCustomEvents } from "utils/shouldSendCustomEvents";
import ExportableChart from "./ExportableChart";

const Wrapper = styled.div`
  color: ${theme.colors.lightGrey};

  .p-tabview .p-tabview-nav {
    background: transparent;
    border-color: ${theme.colors.midGrey};
  }

  .p-tabview.p-tabview-scrollable .p-tabview-nav-container {
    display: flex;
    align-items: center;
  }

  .p-tabview.p-tabview-scrollable .p-tabview-nav-prev,
  .p-tabview.p-tabview-scrollable .p-tabview-nav-next {
    position: static;
    flex: 0 0 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .p-tabview.p-tabview-scrollable .p-tabview-nav-content {
    flex: 1 1 auto;
    min-width: 0;
  }

  .p-tabview .p-tabview-nav li .p-tabview-nav-link {
    background: transparent;
    border-color: ${theme.colors.midGrey};
    color: ${theme.colors.lightGrey};
  }

  .p-tabview
    .p-tabview-nav
    li:not(.p-highlight):not(.p-disabled):hover
    .p-tabview-nav-link {
    border-bottom-width: 3px;
    border-color: ${theme.colors.green};
    color: ${theme.colors.white};
  }

  .p-tabview .p-tabview-nav li .p-tabview-nav-link:not(.p-disabled):focus {
    box-shadow: none !important;
    border-color: ${theme.colors.green} !important;
    color: ${theme.colors.white};
  }

  .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
    border-bottom-width: 3px;
    border-color: ${theme.colors.green};
    color: ${theme.colors.white};
  }

  .p-tabview .p-tabview-nav-btn.p-link {
    background: transparent;
    color: ${theme.colors.lightGrey};
    width: 3rem;
    box-shadow: none;
    border-radius: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .p-tabview .p-tabview-nav-btn:hover,
  .p-tabview .p-tabview-nav-btn:focus {
    color: ${theme.colors.white};
  }

  .p-tabview .p-tabview-nav-btn.p-link:focus {
    box-shadow: none !important;
  }

  .p-tabview .p-tabview-nav .p-tabview-ink-bar {
    background-color: ${theme.colors.green} !important;
  }

  .p-tabview .p-tabview-panels {
    background: transparent;
    color: ${theme.colors.lightGrey};
    padding: 1rem 0 0;
  }

  .p-datatable .p-datatable-thead > tr > th {
    background: ${theme.colors.dark};
    color: ${theme.colors.lightGrey};
    border-color: ${theme.colors.midGrey};
  }

  .p-datatable .p-sortable-column:focus {
    box-shadow: inset 0 0 0 0.15rem rgba(40, 167, 69, 0.35);
    outline: 0 none;
  }

  .p-datatable .p-sortable-column.p-highlight:not(.p-sortable-disabled):hover {
    background: rgba(40, 167, 69, 0.16);
    color: rgba(255, 255, 255, 0.87);
  }

  .p-datatable .p-datatable-tbody > tr > td {
    background: ${theme.colors.dark};
    color: ${theme.colors.white};
    border-color: ${theme.colors.midGrey};
    font-size: 1rem;
    font-weight: 500;
  }
`;

const SectionTitle = styled.h3`
  color: ${theme.colors.white};
  font-size: 1rem;
  margin: 0 0 0.75rem;
`;

const Section = styled.section`
  margin: 0 0 1.25rem;
`;

const HelperText = styled.p`
  margin: 0.5rem 0 0;
  color: ${theme.colors.lightGrey};
  font-size: 0.9rem;
`;

const StatsGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  margin: 0 0 1rem;
`;

const StatCard = styled.div`
  border: 1px solid ${theme.colors.midGrey};
  background: ${theme.colors.dark};
  border-radius: 0.25rem;
  padding: 0.6rem 0.7rem;
`;

const StatLabel = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${theme.colors.lightGrey};
`;

const StatValue = styled.p`
  margin: 0.15rem 0 0;
  font-size: 1rem;
  color: ${theme.colors.white};
  font-weight: 600;
`;

const EpisodeLink = styled.a`
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
  text-decoration: none;
  &:hover {
    color: ${theme.colors.green};
    text-decoration: underline;
  }
`;

const integerFormatter = new Intl.NumberFormat();

const formatNumber = (value) => integerFormatter.format(Number(value) || 0);

const formatRating = (rating, digits = 2) =>
  typeof rating === "number" ? rating.toFixed(digits) : "-";

const formatDate = (dateValue) => {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const toEpisodeSortValue = (episode) =>
  typeof episode?.season === "number" && typeof episode?.episode === "number"
    ? episode.season * 1000 + episode.episode
    : -1;

const toDateSortValue = (dateValue) => {
  if (!dateValue) return -1;
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? -1 : date.getTime();
};

const buildDistributionFromSeasons = (seasons = []) =>
  seasons.reduce((accumulator, season) => {
    const seasonDistribution = season?.rating_distribution || {};
    Object.entries(seasonDistribution).forEach(([rating, count]) => {
      accumulator[rating] = (accumulator[rating] || 0) + (count || 0);
    });
    return accumulator;
  }, {});

const toDistributionRows = (distribution = {}) =>
  Object.entries(distribution)
    .map(([rating, episodes]) => ({
      rating: Number(rating),
      episodes: Number(episodes) || 0,
    }))
    .filter((row) => Number.isFinite(row.rating))
    .sort((a, b) => a.rating - b.rating);

const getSeasonDistributionParts = (distribution = {}, bucketOrder = []) => {
  const rows = toDistributionRows(distribution);
  if (rows.length === 0) return [];

  const episodesByRating = rows.reduce((accumulator, row) => {
    accumulator[row.rating] = row.episodes;
    return accumulator;
  }, {});

  const totalEpisodes = rows.reduce(
    (accumulator, row) => accumulator + row.episodes,
    0,
  );

  const ratings =
    bucketOrder.length > 0 ? bucketOrder : rows.map((row) => row.rating);

  return ratings
    .map((rating) => {
      const episodes = episodesByRating[rating] || 0;
      const share =
        totalEpisodes > 0
          ? ((episodes / totalEpisodes) * 100).toFixed(1)
          : "0.0";
      if (episodes <= 0) return null;
      return { rating, episodes, share };
    })
    .filter(Boolean);
};

const buildDistributionChartData = (distributionRows = [], label) => ({
  labels: distributionRows.map((row) => row.rating),
  datasets: [
    {
      label,
      data: distributionRows.map((row) => row.episodes),
      backgroundColor: theme.colors.green,
      borderColor: theme.colors.green,
      borderWidth: 1,
    },
  ],
});

const hasValidAverageUsersRating = (season) =>
  typeof season.averageUsersRating === "number" &&
  Number.isFinite(season.averageUsersRating);

const hasEpisodeEvolutionData = (season) =>
  Array.isArray(season.episodeEvolutionRows) &&
  season.episodeEvolutionRows.length > 0;

const RatingsChart = ({ tvshowId, allocineUrl, pageTitle }) => {
  const endpoint = `${config.base_render_api}/tvshow/${tvshowId}/seasons?append_to_response=highest_episode,last_episode,lowest_episode,next_episode,rating_distribution,rating_distribution_episodes`;
  const { data, loading, error } = useFetch(endpoint);

  useEffect(() => {
    if (shouldSendCustomEvents() && allocineUrl) {
      window.beam?.(`/custom-events/ratings_chart_opened/${allocineUrl}`);
    }
  }, [allocineUrl]);

  const seasons = useMemo(
    () => (Array.isArray(data?.seasons) ? data.seasons : []),
    [data],
  );

  const seasonRows = useMemo(
    () =>
      seasons.map((season) => ({
        seasonLabel: `S${season.season_number}`,
        seasonNumber: season.season_number,
        episodesCount: season.episodes_count,
        averageUsersRating: season.average_users_rating,
        usersRatingCount: season.users_rating_count,
        highestEpisode: season.highest_episode,
        lowestEpisode: season.lowest_episode,
        ratingDistribution: season.rating_distribution || {},
      })),
    [seasons],
  );

  const seasonRowsWithAverage = useMemo(
    () => seasonRows.filter(hasValidAverageUsersRating),
    [seasonRows],
  );

  const seasonChartData = useMemo(
    () => ({
      labels: seasonRowsWithAverage.map((season) => season.seasonLabel),
      datasets: [
        {
          label: "IMDb average users rating",
          data: seasonRowsWithAverage.map(
            (season) => season.averageUsersRating,
          ),
          fill: false,
          borderColor: theme.colors.green,
          backgroundColor: theme.colors.green,
          borderWidth: 2,
          tension: 0.25,
        },
      ],
    }),
    [seasonRowsWithAverage],
  );

  const seasonDetailsTabs = useMemo(
    () =>
      seasonRows.map((season) => {
        const seasonData =
          seasons.find((item) => item.season_number === season.seasonNumber) ||
          {};
        const distributionRowsBase = toDistributionRows(
          season.ratingDistribution,
        );
        const distributionTotal = distributionRowsBase.reduce(
          (accumulator, row) => accumulator + row.episodes,
          0,
        );
        const distributionRows = distributionRowsBase.map((row) => ({
          ...row,
          share:
            distributionTotal > 0
              ? (row.episodes / distributionTotal) * 100
              : 0,
        }));

        const seasonEpisodesRows = Object.entries(
          seasonData.rating_distribution_episodes || {},
        ).flatMap(([ratingRange, episodes]) =>
          (episodes || []).map((episode) => ({
            ratingRange: Number(ratingRange),
            season: episode.season,
            episode: episode.episode,
            title: episode.title || "Not available",
            usersRating: episode.users_rating,
            usersRatingCount: episode.users_rating_count,
            releaseDate: episode.release_date,
            releaseDateTs: toDateSortValue(episode.release_date),
            episodeSort: toEpisodeSortValue(episode),
            url: episode.url,
          })),
        );

        const distributionEpisodesRows = [...seasonEpisodesRows].sort(
          (a, b) =>
            (b.usersRating || 0) - (a.usersRating || 0) ||
            b.ratingRange - a.ratingRange ||
            (a.episode || 0) - (b.episode || 0),
        );

        const episodeEvolutionRows = [...seasonEpisodesRows].sort(
          (a, b) => (a.episode || 0) - (b.episode || 0),
        );

        const episodeEvolutionChartData = {
          labels: episodeEvolutionRows.map((episode) => `E${episode.episode}`),
          datasets: [
            {
              label: "IMDb users rating",
              data: episodeEvolutionRows.map((episode) => episode.usersRating),
              fill: false,
              borderColor: theme.colors.green,
              backgroundColor: theme.colors.green,
              borderWidth: 2,
              tension: 0.25,
            },
          ],
        };

        return {
          ...season,
          distributionRows,
          distributionTotal,
          episodeEvolutionRows,
          episodeEvolutionChartData,
          distributionEpisodesRows,
          highlightsRows: [
            {
              type: "Highest rated episode",
              episode: season.highestEpisode,
              episodeSort: toEpisodeSortValue(season.highestEpisode),
              episodeRating: season.highestEpisode?.users_rating ?? null,
              episodeVotes: season.highestEpisode?.users_rating_count ?? null,
              releaseDate: season.highestEpisode?.release_date ?? null,
              releaseDateTs: toDateSortValue(
                season.highestEpisode?.release_date,
              ),
            },
            {
              type: "Lowest rated episode",
              episode: season.lowestEpisode,
              episodeSort: toEpisodeSortValue(season.lowestEpisode),
              episodeRating: season.lowestEpisode?.users_rating ?? null,
              episodeVotes: season.lowestEpisode?.users_rating_count ?? null,
              releaseDate: season.lowestEpisode?.release_date ?? null,
              releaseDateTs: toDateSortValue(
                season.lowestEpisode?.release_date,
              ),
            },
          ],
        };
      }),
    [seasonRows, seasons],
  );

  const seasonDetailsTabsWithGraphData = useMemo(
    () => seasonDetailsTabs.filter(hasEpisodeEvolutionData),
    [seasonDetailsTabs],
  );

  const seasonChartOptions = useMemo(
    () => ({
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: {
            color: theme.colors.lightGrey,
          },
          grid: {
            color: theme.colors.midGrey,
          },
        },
        x: {
          ticks: {
            color: theme.colors.lightGrey,
          },
          grid: {
            color: theme.colors.midGrey,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: theme.colors.lightGrey,
          },
        },
      },
      aspectRatio: 2.35,
    }),
    [],
  );

  const globalDistribution = useMemo(() => {
    if (
      data?.rating_distribution &&
      Object.keys(data.rating_distribution).length > 0
    ) {
      return data.rating_distribution;
    }
    return buildDistributionFromSeasons(seasons);
  }, [data, seasons]);

  const globalDistributionRows = useMemo(
    () => toDistributionRows(globalDistribution),
    [globalDistribution],
  );

  const distributionTotal = useMemo(
    () =>
      globalDistributionRows.reduce(
        (accumulator, row) => accumulator + (row.episodes || 0),
        0,
      ),
    [globalDistributionRows],
  );

  const globalDistributionRowsWithShare = useMemo(
    () =>
      globalDistributionRows.map((row) => ({
        ...row,
        share:
          distributionTotal > 0 ? (row.episodes / distributionTotal) * 100 : 0,
      })),
    [globalDistributionRows, distributionTotal],
  );

  const distributionChartData = useMemo(
    () => buildDistributionChartData(globalDistributionRows, "Episodes count"),
    [globalDistributionRows],
  );

  const distributionChartOptions = useMemo(
    () => ({
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: theme.colors.lightGrey,
          },
          grid: {
            color: theme.colors.midGrey,
          },
        },
        x: {
          ticks: {
            color: theme.colors.lightGrey,
          },
          grid: {
            color: theme.colors.midGrey,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: theme.colors.lightGrey,
          },
        },
      },
      aspectRatio: 2.35,
    }),
    [],
  );

  const seasonDistributionBucketOrder = useMemo(() => {
    const uniqueRatings = new Set();
    seasonRows.forEach((season) => {
      Object.keys(season.ratingDistribution || {}).forEach((rating) => {
        const numericRating = Number(rating);
        if (Number.isFinite(numericRating)) uniqueRatings.add(numericRating);
      });
    });
    return [...uniqueRatings].sort((a, b) => a - b);
  }, [seasonRows]);

  const seasonDistributionRows = useMemo(
    () =>
      seasonRowsWithAverage.map((season) => {
        const distributionParts = getSeasonDistributionParts(
          season.ratingDistribution,
          seasonDistributionBucketOrder,
        );
        return {
          seasonLabel: season.seasonLabel,
          seasonNumber: season.seasonNumber,
          averageUsersRating: season.averageUsersRating,
          distributionParts,
          distributionText: distributionParts
            .map((part) => `${part.rating}: ${part.episodes} (${part.share}%)`)
            .join(" - "),
        };
      }),
    [seasonRowsWithAverage, seasonDistributionBucketOrder],
  );

  const totalEpisodesCount = useMemo(
    () =>
      seasonRows.reduce(
        (accumulator, season) => accumulator + (season.episodesCount || 0),
        0,
      ),
    [seasonRows],
  );

  const totalVotesCount = useMemo(
    () =>
      seasonRows.reduce(
        (accumulator, season) => accumulator + (season.usersRatingCount || 0),
        0,
      ),
    [seasonRows],
  );

  const showTimelineRows = useMemo(() => {
    const rows = [];
    if (data?.last_episode) {
      rows.push({
        type: "Last episode",
        episode: data.last_episode,
        episodeSort: toEpisodeSortValue(data.last_episode),
        rating: data.last_episode?.users_rating ?? null,
        releaseDate: data.last_episode?.release_date ?? null,
        releaseDateTs: toDateSortValue(data.last_episode?.release_date),
      });
    }
    if (data?.next_episode) {
      rows.push({
        type: "Next episode",
        episode: data.next_episode,
        episodeSort: toEpisodeSortValue(data.next_episode),
        rating: data.next_episode?.users_rating ?? null,
        releaseDate: data.next_episode?.release_date ?? null,
        releaseDateTs: toDateSortValue(data.next_episode?.release_date),
      });
    }
    return rows;
  }, [data]);

  const allSeasonsHighlightsRows = useMemo(
    () =>
      seasonRowsWithAverage.map((season) => ({
        seasonLabel: season.seasonLabel,
        seasonNumber: season.seasonNumber,
        highestEpisode: season.highestEpisode,
        highestRating: season.highestEpisode?.users_rating ?? null,
        highestEpisodeSort: toEpisodeSortValue(season.highestEpisode),
        lowestEpisode: season.lowestEpisode,
        lowestRating: season.lowestEpisode?.users_rating ?? null,
        lowestEpisodeSort: toEpisodeSortValue(season.lowestEpisode),
      })),
    [seasonRowsWithAverage],
  );

  const weightedAverage = useMemo(() => {
    const weightedSum = seasonRows.reduce(
      (accumulator, season) =>
        accumulator +
        (season.averageUsersRating || 0) * (season.episodesCount || 0),
      0,
    );
    return totalEpisodesCount > 0 ? weightedSum / totalEpisodesCount : null;
  }, [seasonRows, totalEpisodesCount]);

  const seasonEpisodeBody = (episode) => {
    if (!episode) return "-";
    const label = `S${episode.season}E${episode.episode}: ${episode.title}`;
    if (!episode.url) return label;
    return (
      <EpisodeLink href={episode.url} target="_blank" rel="noreferrer">
        {label}
      </EpisodeLink>
    );
  };

  const episodeTitleBody = (row) => {
    if (!row.url || row.title === "Not available") return row.title;
    return (
      <EpisodeLink href={row.url} target="_blank" rel="noreferrer">
        {row.title}
      </EpisodeLink>
    );
  };

  const ratingRangeBody = (row) =>
    typeof row.ratingRange === "number" ? row.ratingRange : "-";

  const showTitle = pageTitle || "TV show";

  const seasonDistributionBody = (row) => {
    if (!row.distributionParts || row.distributionParts.length === 0)
      return "-";
    return row.distributionParts.map((part, index) => (
      <React.Fragment key={`${part.rating}-${index}`}>
        {index > 0 ? " - " : ""}
        {`${part.rating}: ${part.episodes} `}
        <span
          style={{ color: theme.colors.lightGrey, fontWeight: 400 }}
        >{`(${part.share}%)`}</span>
      </React.Fragment>
    ));
  };

  if (loading) {
    return <Wrapper>Loading ratings insights...</Wrapper>;
  }

  if (error) {
    return (
      <Wrapper>
        Unable to load ratings insights for this show right now.
      </Wrapper>
    );
  }

  if (seasonRows.length === 0) {
    return (
      <Wrapper>No season-level ratings are available for this show.</Wrapper>
    );
  }

  return (
    <Wrapper>
      <TabView scrollable>
        <TabPanel header="All">
          <Section>
            <SectionTitle>Average rating trend by season</SectionTitle>
            <ExportableChart
              type="line"
              data={seasonChartData}
              options={seasonChartOptions}
              filename="ratings-all-seasons"
              watermarkTitle={showTitle}
            />
          </Section>

          <Section>
            <SectionTitle>Season highlights</SectionTitle>
            <DataTable
              value={allSeasonsHighlightsRows}
              size="small"
              responsiveLayout="scroll"
              defaultSortOrder={-1}
            >
              <Column
                field="seasonNumber"
                header="Season"
                body={(row) => row.seasonLabel}
                sortable
              />
              <Column
                header="Highest episode"
                body={(row) => seasonEpisodeBody(row.highestEpisode)}
                sortField="highestEpisodeSort"
                sortable
              />
              <Column
                field="highestRating"
                header="Highest rating"
                body={(row) => formatRating(row.highestRating, 1)}
                sortable
              />
              <Column
                header="Lowest episode"
                body={(row) => seasonEpisodeBody(row.lowestEpisode)}
                sortField="lowestEpisodeSort"
                sortable
              />
              <Column
                field="lowestRating"
                header="Lowest rating"
                body={(row) => formatRating(row.lowestRating, 1)}
                sortable
              />
            </DataTable>
          </Section>

          {showTimelineRows.length > 0 && (
            <Section>
              <SectionTitle>Show timeline</SectionTitle>
              <DataTable
                value={showTimelineRows}
                size="small"
                responsiveLayout="scroll"
                defaultSortOrder={-1}
              >
                <Column field="type" header="Type" sortable />
                <Column
                  header="Episode"
                  body={(row) => seasonEpisodeBody(row.episode)}
                  sortField="episodeSort"
                  sortable
                />
                <Column
                  field="rating"
                  header="Rating"
                  body={(row) => formatRating(row.rating, 1)}
                  sortable
                />
                <Column
                  field="releaseDateTs"
                  header="Release date"
                  body={(row) => formatDate(row.releaseDate)}
                  sortable
                />
              </DataTable>
            </Section>
          )}
        </TabPanel>

        {seasonDetailsTabsWithGraphData.map((season) => (
          <TabPanel key={season.seasonNumber} header={season.seasonLabel}>
            <Section>
              <SectionTitle>
                {season.seasonLabel} ratings evolution by episode
              </SectionTitle>
              <ExportableChart
                type="line"
                data={season.episodeEvolutionChartData}
                options={seasonChartOptions}
                filename={`ratings-${season.seasonLabel.toLowerCase()}`}
                watermarkTitle={showTitle}
              />
            </Section>

            <Section>
              <SectionTitle>{season.seasonLabel} summary</SectionTitle>
              <StatsGrid>
                <StatCard>
                  <StatLabel>Episodes</StatLabel>
                  <StatValue>{formatNumber(season.episodesCount)}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Average rating</StatLabel>
                  <StatValue>
                    {formatRating(season.averageUsersRating)}
                  </StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Total votes</StatLabel>
                  <StatValue>{formatNumber(season.usersRatingCount)}</StatValue>
                </StatCard>
              </StatsGrid>
            </Section>

            <Section>
              <SectionTitle>Season highlights</SectionTitle>
              <DataTable
                value={season.highlightsRows}
                size="small"
                responsiveLayout="scroll"
                defaultSortOrder={-1}
              >
                <Column field="type" header="Type" sortable />
                <Column
                  header="Episode"
                  body={(row) => seasonEpisodeBody(row.episode)}
                  sortField="episodeSort"
                  sortable
                />
                <Column
                  field="episodeRating"
                  header="Rating"
                  body={(row) => formatRating(row.episodeRating, 1)}
                  sortable
                />
                <Column
                  field="episodeVotes"
                  header="Votes"
                  body={(row) =>
                    typeof row.episodeVotes === "number"
                      ? formatNumber(row.episodeVotes)
                      : "-"
                  }
                  sortable
                />
                <Column
                  field="releaseDateTs"
                  header="Release date"
                  body={(row) => formatDate(row.releaseDate)}
                  sortable
                />
              </DataTable>
            </Section>

            <Section>
              <DataTable
                value={season.distributionRows}
                size="small"
                responsiveLayout="scroll"
                defaultSortOrder={-1}
              >
                <Column field="rating" header="Rating range" sortable />
                <Column field="episodes" header="Episodes" sortable />
                <Column
                  field="share"
                  header="Share"
                  body={(row) =>
                    season.distributionTotal > 0
                      ? `${row.share.toFixed(1)}%`
                      : "-"
                  }
                  sortable
                />
              </DataTable>
            </Section>

            <Section>
              <SectionTitle>
                {season.seasonLabel} episodes by rating range
              </SectionTitle>
              <DataTable
                value={season.distributionEpisodesRows}
                size="small"
                responsiveLayout="scroll"
                defaultSortOrder={-1}
              >
                <Column
                  field="ratingRange"
                  header="Range"
                  body={ratingRangeBody}
                  sortable
                />
                <Column
                  header="Episode"
                  body={(row) =>
                    typeof row.season === "number" &&
                    typeof row.episode === "number"
                      ? `S${row.season}E${row.episode}`
                      : "-"
                  }
                  sortField="episodeSort"
                  sortable
                />
                <Column
                  field="title"
                  header="Title"
                  body={episodeTitleBody}
                  sortable
                />
                <Column
                  field="usersRating"
                  header="Rating"
                  body={(row) => formatRating(row.usersRating, 1)}
                  sortable
                />
                <Column
                  field="usersRatingCount"
                  header="Votes"
                  body={(row) =>
                    typeof row.usersRatingCount === "number"
                      ? formatNumber(row.usersRatingCount)
                      : "-"
                  }
                  sortable
                />
                <Column
                  field="releaseDateTs"
                  header="Release date"
                  body={(row) => formatDate(row.releaseDate)}
                  sortable
                />
              </DataTable>
              {season.distributionEpisodesRows.length === 0 && (
                <HelperText>
                  No episode-level distribution data is available for this
                  season.
                </HelperText>
              )}
            </Section>
          </TabPanel>
        ))}

        <TabPanel header="Distribution">
          <Section>
            <SectionTitle>All ratings distribution</SectionTitle>
            <ExportableChart
              type="bar"
              data={distributionChartData}
              options={distributionChartOptions}
              filename="ratings-distribution"
              watermarkTitle={`${showTitle} - Distribution`}
              chartStyle={{ width: "97.5%", margin: "0 auto" }}
            />
            <HelperText>
              Ratings grouped by rounded IMDb episode range.
            </HelperText>
          </Section>

          <Section>
            <SectionTitle>Show-level summary</SectionTitle>
            <StatsGrid>
              <StatCard>
                <StatLabel>Seasons</StatLabel>
                <StatValue>{seasonRows.length}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Episodes</StatLabel>
                <StatValue>{formatNumber(totalEpisodesCount)}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Weighted avg rating</StatLabel>
                <StatValue>{formatRating(weightedAverage)}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Total votes</StatLabel>
                <StatValue>{formatNumber(totalVotesCount)}</StatValue>
              </StatCard>
            </StatsGrid>
          </Section>

          <Section>
            <DataTable
              value={globalDistributionRowsWithShare}
              size="small"
              responsiveLayout="scroll"
              defaultSortOrder={-1}
            >
              <Column field="rating" header="Rating range" sortable />
              <Column field="episodes" header="Episodes" sortable />
              <Column
                field="share"
                header="Share"
                body={(row) =>
                  distributionTotal > 0 ? `${row.share.toFixed(1)}%` : "-"
                }
                sortable
              />
            </DataTable>
          </Section>

          <Section>
            <SectionTitle>Per-season distribution</SectionTitle>
            <DataTable
              value={seasonDistributionRows}
              size="small"
              responsiveLayout="scroll"
              defaultSortOrder={-1}
            >
              <Column
                field="seasonNumber"
                header="Season"
                body={(row) => row.seasonLabel}
                sortable
              />
              <Column
                field="averageUsersRating"
                header="Avg rating"
                body={(row) => formatRating(row.averageUsersRating)}
                sortable
              />
              <Column
                field="distributionText"
                header="Distribution (rating: episodes, %)"
                body={seasonDistributionBody}
                sortable
              />
            </DataTable>
          </Section>
        </TabPanel>
      </TabView>
    </Wrapper>
  );
};

export default RatingsChart;
