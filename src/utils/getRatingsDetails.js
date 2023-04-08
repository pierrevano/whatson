import React from "react";

/**
 * Returns an array of objects containing details about the ratings of a movie or TV show
 * from various sources such as AlloCiné, BetaSeries, and IMDb.
 * @param {string} allocine_url - The URL of the movie or TV show on AlloCiné.
 * @param {string} betaseries_url - The URL of the movie or TV show on BetaSeries.
 * @param {string} imdb_url - The URL of the movie or TV show on IMDb.
 * @param {number} allocine_users_rating - The rating of the movie or TV show by AlloCiné users.
 * @param {number} allocine_critics_rating - The rating of the movie or
 */
export const getRatingsDetails = (allocine_url, betaseries_url, imdb_url, allocine_users_rating, allocine_critics_rating, betaseries_users_rating, imdb_users_rating) => {
  const detailsConfig = {
    baseURLPublicAssets: "https://whatson-public.surge.sh",

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
      rating: imdb_users_rating / 2,
    },
  ];

  const logoBody = (rowData) => {
    const baseURLPublicAssets = detailsConfig.baseURLPublicAssets;
    const image = rowData.image;
    const name = rowData.name;

    return (
      <div className="flex align-items-center p-overlaypanel-logo">
        <img alt={name} src={`${baseURLPublicAssets}/${image}`} />
      </div>
    );
  };

  const ratingBody = (rowData) => {
    const rating = rowData.rating;

    if (rating > 0)
      return (
        <span className="rating_value">
          <span>★</span> {rating}
          <span>/5</span>
        </span>
      );
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
    } else {
      link = name;
    }

    return <div className="flex align-items-center">{link}</div>;
  };

  return {
    detailsData,
    logoBody,
    nameBody,
    ratingBody,
  };
};
