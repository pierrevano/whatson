import React from "react";
import config from "./config";

export const getRatingsDetails = (allocine_critics_rating, allocine_url, allocine_users_rating, betaseries_url, betaseries_users_rating, imdb_url, imdb_users_rating, metacritic_critics_rating, metacritic_url, metacritic_users_rating, mojo_ranking, mojo_url) => {
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
  ];

  const mojoDetailsData = [
    {
      image: detailsConfig.mojo_box_office.image,
      name: detailsConfig.mojo_box_office.name,
      ranking: mojo_ranking,
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
    if (rowData.name === "IMDb users" || rowData.name === "Metacritic users") {
      maxRating = 10;
    } else if (rowData.name === "Metacritic critics") {
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

  const rankingBody = (rowData) => {
    const ranking = rowData.ranking;

    if (ranking > 0) return <span className="ranking_value">{ranking}</span>;
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
    const ranking = rowData.ranking;

    let link;
    if (name === "AlloCiné users" && rating > 0) {
      link = (
        <a href={`${editURL(allocine_url)}/critiques/`} target={"_blank"}>
          {name}
        </a>
      );
    } else if (name === "AlloCiné critics" && rating > 0) {
      link = (
        <a href={`${editURL(allocine_url)}/critiques/presse/`} target={"_blank"}>
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
    } else if (name === "Mojo ranking" && ranking > 0) {
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
    rankingBody,
  };
};
