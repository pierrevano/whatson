import { css } from "styled-components";
import { stringify, parse } from "./pixels";

export const utility = (breakpoints) =>
  Object.keys(breakpoints).reduce((acc, label) => {
    acc[label] = (...args) => css`
      @media (min-width: ${stringify(parse(breakpoints[label].width))}) {
        ${css(...args)}
      }
    `;
    return acc;
  }, {});

/**
 * Returns a function that generates a CSS media query for screens above a certain width.
 * @param {string} label - The label for the breakpoint to target.
 * @returns A function that generates a CSS media query.
 */
export const above =
  (label) =>
  (...args) =>
  ({ theme }) => css`
    @media (min-width: ${stringify(parse(theme.breakpoints[label].width))}) {
      ${css(...args)}
    }
  `;

export default above;
