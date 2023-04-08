import { utility as above } from "./above";

/**
 * Maps the breakpoints of a given object to a function that takes in the value of the breakpoint
 * and the original object of props.
 * @param {object} breakpoints - an object containing the breakpoints to map
 * @param {function} fn - the function to map the breakpoints to
 * @returns A function that takes in an object of props and returns an array of mapped breakpoints.
 */
export const mapPropsBreakpoints = (breakpoints, fn) => (props) =>
  Object.keys(props)
    .filter((prop) => Object.keys(breakpoints).includes(prop))
    .map((label) => above(breakpoints)[label]`${fn(props[label], props)}`);
