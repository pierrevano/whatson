import React from "react";
import Star from "components/Icon/Star";
import NumbersFilter from "components/Icon/NumbersFilter";
import Calendar from "components/Icon/Calendar";
import Trophy from "components/Icon/Trophy";
import UpRightArrow from "components/Icon/UpRightArrow";
import Screen from "components/Icon/Screen";

export const groupedItemTemplate = (option) => {
  let style, IconComponent;
  switch (option.name) {
    case "Minimum ratings":
      style = { transform: "translateY(-4px)", marginTop: "-4px" };
      IconComponent = (
        <UpRightArrow
          style={{
            display: "inline-block",
            transform: "translateY(9px)",
            marginLeft: "-4px",
            marginRight: "4px",
          }}
        ></UpRightArrow>
      );
      break;
    case "Platforms":
      style = { transform: "translateY(-4px)", marginTop: "-4px" };
      IconComponent = (
        <Screen
          style={{
            display: "inline-block",
            transform: "translateY(9px)",
            marginLeft: "-9px",
            marginRight: "4px",
          }}
        ></Screen>
      );
      break;
    case "Popularity":
      style = { transform: "translateY(-5px)" };
      IconComponent = (
        <Trophy
          style={{
            display: "inline-block",
            transform: "translateY(7px)",
            marginLeft: "-2px",
            marginRight: "8px",
          }}
        ></Trophy>
      );
      break;
    case "Ratings":
      style = { transform: "translateY(-2px)" };
      IconComponent = (
        <Star
          style={{
            display: "inline-block",
            transform: "translateY(4px)",
            marginLeft: "-10px",
            marginRight: "4px",
          }}
        ></Star>
      );
      break;
    case "Seasons numbers":
      style = { transform: "translateY(-4px)", marginTop: "-6px" };
      IconComponent = (
        <NumbersFilter
          style={{
            display: "inline-block",
            transform: "translateY(8px)",
            marginLeft: "-4px",
            marginRight: "7px",
          }}
        ></NumbersFilter>
      );
      break;
    default:
      style = { transform: "translateY(-4px)", marginTop: "-4px" };
      IconComponent = (
        <Calendar
          strokeWidth={3}
          style={{
            display: "inline-block",
            transform: "translateY(6px)",
            marginLeft: "-1px",
            marginRight: "9px",
          }}
        ></Calendar>
      );
  }
  return (
    <div className="flex align-items-center" style={style}>
      {IconComponent}
      {option.name}
    </div>
  );
};
