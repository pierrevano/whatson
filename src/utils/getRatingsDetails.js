import React from "react";
import config from "../config";

export const getRatingsDetails = (
  allocine_critics_rating,
  allocine_url,
  allocine_users_rating,
  betaseries_url,
  betaseries_users_rating,
  imdb_url,
  imdb_users_rating,
  letterboxd_url,
  letterboxd_users_rating,
  metacritic_critics_rating,
  metacritic_url,
  metacritic_users_rating,
  rottentomatoes_critics_rating,
  rottentomatoes_url,
  rottentomatoes_users_rating,
  senscritique_url,
  senscritique_users_rating,
  tmdb_url,
  tmdb_users_rating,
  trakt_url,
  trakt_users_rating,
  tvtime_url,
  tvtime_users_rating,
  mojo_rank,
  mojo_url,
  itemType,
  kindURL,
) => {
  const detailsConfig = {
    allocine_users: {
      image: "allocine-logo.png",
      name: "AlloCiné users",
    },
    allocine_critics: {
      image: "allocine-logo.png",
      name: "AlloCiné critics",
    },
    betaseries: {
      image: "betaseries-logo.png",
      name: "BetaSeries users",
    },
    imdb: {
      image: "imdb-logo.png",
      name: "IMDb users",
    },
    metacritic_users: {
      image: "metacritic-logo.png",
      name: "Metacritic users",
    },
    metacritic_critics: {
      image: "metacritic-logo.png",
      name: "Metacritic critics",
    },
    rottentomatoes_users: {
      image: "rotten-tomatoes-logo.png",
      name: "Rotten Tomatoes users",
    },
    rottentomatoes_critics: {
      image: "rotten-tomatoes-logo.png",
      name: "Rotten Tomatoes critics",
    },
    senscritique: {
      image: "senscritique-logo.png",
      name: "SensCritique users",
    },
    tmdb: {
      image: "tmdb-logo.png",
      name: "TMDB users",
    },
    trakt: {
      image: "trakt-logo.png",
      name: "Trakt users",
    },
    mojo_box_office: {
      image: "mojo-logo.png",
      name: "Mojo worldwide",
    },
  };

  const detailsData = [];

  const ratings = [
    { key: "allocine_users", rating: allocine_users_rating },
    { key: "allocine_critics", rating: allocine_critics_rating },
    { key: "betaseries", rating: betaseries_users_rating },
    { key: "imdb", rating: imdb_users_rating },
    { key: "metacritic_users", rating: metacritic_users_rating },
    { key: "metacritic_critics", rating: metacritic_critics_rating },
    { key: "rottentomatoes_users", rating: rottentomatoes_users_rating },
    { key: "rottentomatoes_critics", rating: rottentomatoes_critics_rating },
    { key: "senscritique", rating: senscritique_users_rating },
    { key: "tmdb", rating: tmdb_users_rating },
    { key: "trakt", rating: trakt_users_rating },
  ];

  ratings.forEach(({ key, rating }) => {
    if (rating && rating > 0) {
      detailsData.push({
        image: detailsConfig[key].image,
        name: detailsConfig[key].name,
        rating: rating,
      });
    }
  });

  if (letterboxd_users_rating && letterboxd_users_rating > 0) {
    detailsConfig.letterboxd = {
      image: "letterboxd-logo.png",
      name: "Letterboxd users",
    };

    detailsData.splice(4, 0, {
      image: detailsConfig.letterboxd.image,
      name: detailsConfig.letterboxd.name,
      rating: letterboxd_users_rating,
    });
  }

  if (tvtime_users_rating && tvtime_users_rating > 0) {
    detailsConfig.tvtime = {
      image: "tvtime-logo.png",
      name: "TV Time users",
    };

    detailsData.push({
      image: detailsConfig.tvtime.image,
      name: detailsConfig.tvtime.name,
      rating: tvtime_users_rating,
    });
  }

  let mojoDetailsData = [];
  if (mojo_rank && mojo_rank > 0) {
    mojoDetailsData.push({
      image: detailsConfig.mojo_box_office.image,
      name: detailsConfig.mojo_box_office.name,
      rank: mojo_rank,
    });
  }

  const logoBody = (rowData) => {
    const image = rowData.image;
    const name = rowData.name;

    return (
      <div className="flex align-items-center p-overlaypanel-logo">
        <img alt={name} src={`${config.base_render}/${image}`} />
      </div>
    );
  };

  const ratingBody = (rowData) => {
    const rating = rowData.rating;
    let maxRating = 5;
    if (
      rowData.name === "IMDb users" ||
      rowData.name === "Metacritic users" ||
      rowData.name === "SensCritique users" ||
      rowData.name === "TMDB users" ||
      rowData.name === "TV Time users"
    ) {
      maxRating = 10;
    } else if (
      rowData.name === "Metacritic critics" ||
      rowData.name === "Rotten Tomatoes users" ||
      rowData.name === "Rotten Tomatoes critics" ||
      rowData.name === "Trakt users"
    ) {
      maxRating = 100;
    }

    if (rating > 0)
      return (
        <span className="rating_value">
          <span>★</span> {rating}
          <span>/{maxRating}</span>
        </span>
      );
    return "/";
  };

  const rankBody = (rowData) => {
    const rank = rowData.rank;

    if (rank > 0) {
      return (
        <span className="rank_value">
          <span role="img" aria-label="trophy">
            🏆
          </span>{" "}
          {rank}
        </span>
      );
    }
    return "/";
  };

  const editURL = (url) => {
    const first_regex = /(_gen_cfilm=|_gen_cserie=)/;
    const second_regex = /\.html$/;

    return url.replace(first_regex, "-").replace(second_regex, "");
  };

  const nameBody = (rowData) => {
    const name = rowData.name;
    const rating = rowData.rating;
    const rank = rowData.rank;

    let link;
    if (name === "AlloCiné users" && rating > 0) {
      link = (
        <a
          href={`${editURL(allocine_url)}/critiques/`}
          target={"_blank"}
          rel="noopener noreferrer"
        >
          {name}
        </a>
      );
    } else if (name === "AlloCiné critics" && rating > 0) {
      link = (
        <a
          href={`${editURL(allocine_url)}/critiques/presse/`}
          target={"_blank"}
          rel="noopener noreferrer"
        >
          {name}
        </a>
      );
    } else if (name === "BetaSeries users" && rating > 0) {
      link = (
        <a href={betaseries_url} target={"_blank"} rel="noopener noreferrer">
          {name}
        </a>
      );
    } else if (name === "IMDb users" && rating > 0) {
      link = (
        <a href={imdb_url} target={"_blank"} rel="noopener noreferrer">
          {name}
        </a>
      );
    } else if (name === "Letterboxd users" && rating > 0) {
      link = (
        <a href={letterboxd_url} target={"_blank"} rel="noopener noreferrer">
          {name}
        </a>
      );
    } else if (name === "Metacritic users" && rating > 0) {
      link = (
        <a
          href={`${metacritic_url}/user-reviews`}
          target={"_blank"}
          rel="noopener noreferrer"
        >
          {name}
        </a>
      );
    } else if (name === "Metacritic critics" && rating > 0) {
      link = (
        <a
          href={`${metacritic_url}/critic-reviews`}
          target={"_blank"}
          rel="noopener noreferrer"
        >
          {name}
        </a>
      );
    } else if (name === "Rotten Tomatoes users" && rating > 0) {
      link = (
        <a
          href={`${rottentomatoes_url}`}
          target={"_blank"}
          rel="noopener noreferrer"
        >
          {name}
        </a>
      );
    } else if (name === "Rotten Tomatoes critics" && rating > 0) {
      link = (
        <a
          href={`${rottentomatoes_url}`}
          target={"_blank"}
          rel="noopener noreferrer"
        >
          {name}
        </a>
      );
    } else if (name === "SensCritique users" && rating > 0) {
      link = (
        <a href={senscritique_url} target={"_blank"} rel="noopener noreferrer">
          {name}
        </a>
      );
    } else if (name === "TMDB users" && rating > 0) {
      link = (
        <a href={tmdb_url} target={"_blank"} rel="noopener noreferrer">
          {name}
        </a>
      );
    } else if (name === "Trakt users" && rating > 0) {
      link = (
        <a href={trakt_url} target={"_blank"} rel="noopener noreferrer">
          {name}
        </a>
      );
    } else if (name === "TV Time users" && rating > 0) {
      link = (
        <a href={tvtime_url} target={"_blank"} rel="noopener noreferrer">
          {name}
        </a>
      );
    } else if (name === "Mojo worldwide" && rank > 0) {
      link = (
        <a href={`${mojo_url}`} target={"_blank"} rel="noopener noreferrer">
          {name}
        </a>
      );
    } else {
      link = name;
    }

    return <div className="flex align-items-center">{link}</div>;
  };

  return {
    allocineID:
      allocine_url && allocine_url.replace("https://www.allocine.fr/", ""),
    detailsData,
    mojoDetailsData,
    logoBody,
    nameBody,
    ratingBody,
    rankBody,
  };
};
