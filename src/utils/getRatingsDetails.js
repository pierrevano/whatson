import React from "react";
import config from "./config";

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
  rottenTomatoes_critics_rating,
  rottenTomatoes_url,
  rottenTomatoes_users_rating,
  senscritique_url,
  senscritique_users_rating,
  tmdb_url,
  tmdb_users_rating,
  trakt_url,
  trakt_users_rating,
  mojo_rank,
  mojo_url,
  itemType,
  kindURL
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
    rottenTomatoes_users: {
      image: "rotten-tomatoes-logo.png",
      name: "Rotten Tomatoes users",
    },
    rottenTomatoes_critics: {
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

  const detailsData = [
    {
      image: detailsConfig.allocine_users.image,
      name: detailsConfig.allocine_users.name,
      rating: allocine_users_rating,
    },
    {
      image: detailsConfig.allocine_critics.image,
      name: detailsConfig.allocine_critics.name,
      rating: allocine_critics_rating,
    },
    {
      image: detailsConfig.betaseries.image,
      name: detailsConfig.betaseries.name,
      rating: betaseries_users_rating,
    },
    {
      image: detailsConfig.imdb.image,
      name: detailsConfig.imdb.name,
      rating: imdb_users_rating,
    },
    {
      image: detailsConfig.metacritic_users.image,
      name: detailsConfig.metacritic_users.name,
      rating: metacritic_users_rating,
    },
    {
      image: detailsConfig.metacritic_critics.image,
      name: detailsConfig.metacritic_critics.name,
      rating: metacritic_critics_rating,
    },
    {
      image: detailsConfig.rottenTomatoes_users.image,
      name: detailsConfig.rottenTomatoes_users.name,
      rating: rottenTomatoes_users_rating,
    },
    {
      image: detailsConfig.rottenTomatoes_critics.image,
      name: detailsConfig.rottenTomatoes_critics.name,
      rating: rottenTomatoes_critics_rating,
    },
    {
      image: detailsConfig.senscritique.image,
      name: detailsConfig.senscritique.name,
      rating: senscritique_users_rating,
    },
    {
      image: detailsConfig.tmdb.image,
      name: detailsConfig.tmdb.name,
      rating: tmdb_users_rating,
    },
    {
      image: detailsConfig.trakt.image,
      name: detailsConfig.trakt.name,
      rating: trakt_users_rating,
    },
  ];

  if (itemType === "movie" || kindURL === "movies") {
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

  const mojoDetailsData = [
    {
      image: detailsConfig.mojo_box_office.image,
      name: detailsConfig.mojo_box_office.name,
      rank: mojo_rank,
    },
  ];

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
      rowData.name === "TMDB users"
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
        <a href={`${editURL(allocine_url)}/critiques/`} target={"_blank"}>
          {name}
        </a>
      );
    } else if (name === "AlloCiné critics" && rating > 0) {
      link = (
        <a
          href={`${editURL(allocine_url)}/critiques/presse/`}
          target={"_blank"}
        >
          {name}
        </a>
      );
    } else if (name === "BetaSeries users" && rating > 0) {
      link = (
        <a href={betaseries_url} target={"_blank"}>
          {name}
        </a>
      );
    } else if (name === "IMDb users" && rating > 0) {
      link = (
        <a href={imdb_url} target={"_blank"}>
          {name}
        </a>
      );
    } else if (name === "Letterboxd users" && rating > 0) {
      link = (
        <a href={letterboxd_url} target={"_blank"}>
          {name}
        </a>
      );
    } else if (name === "Metacritic users" && rating > 0) {
      link = (
        <a href={`${metacritic_url}/user-reviews`} target={"_blank"}>
          {name}
        </a>
      );
    } else if (name === "Metacritic critics" && rating > 0) {
      link = (
        <a href={`${metacritic_url}/critic-reviews`} target={"_blank"}>
          {name}
        </a>
      );
    } else if (name === "Rotten Tomatoes users" && rating > 0) {
      link = (
        <a href={`${rottenTomatoes_url}`} target={"_blank"}>
          {name}
        </a>
      );
    } else if (name === "Rotten Tomatoes critics" && rating > 0) {
      link = (
        <a href={`${rottenTomatoes_url}`} target={"_blank"}>
          {name}
        </a>
      );
    } else if (name === "SensCritique users" && rating > 0) {
      link = (
        <a href={senscritique_url} target={"_blank"}>
          {name}
        </a>
      );
    } else if (name === "TMDB users" && rating > 0) {
      link = (
        <a href={tmdb_url} target={"_blank"}>
          {name}
        </a>
      );
    } else if (name === "Trakt users" && rating > 0) {
      link = (
        <a href={trakt_url} target={"_blank"}>
          {name}
        </a>
      );
    } else if (name === "Mojo worldwide" && rank > 0) {
      link = (
        <a href={`${mojo_url}`} target={"_blank"}>
          {name}
        </a>
      );
    } else {
      link = name;
    }

    return <div className="flex align-items-center">{link}</div>;
  };

  return {
    detailsData,
    mojoDetailsData,
    logoBody,
    nameBody,
    ratingBody,
    rankBody,
  };
};
