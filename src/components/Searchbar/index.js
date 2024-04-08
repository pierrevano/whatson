import React from "react";
import styled from "styled-components";
import above from "utils/above";
import Container from "components/Container";

const Wrapper = styled.label`
	background: ${(p) => p.theme.colors.white};
	color: ${(p) => p.theme.colors.lightGrey};
	display: flex;
	align-items: center;
	border-radius: 0.25rem;
	position: relative;
	box-shadow: 0 0 4rem 0.125rem ${(p) => p.theme.colors.dark};
	padding: 0.5rem 0.625rem;
	${above("sm")`
		padding: 0.75rem;
	`}
	&:focus-within{
		&:before{
		content: '';
		border-radius: 0.25rem;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		${(p) => p.theme.focusShadow}}
		}
	}
`;

const Loupe = () => (
  <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.5 14.5l-3.72-3.72" />
      <circle cx="6.67" cy="6.67" r="5.33" />
    </g>
  </svg>
);

const Input = styled.input`
  color: ${(p) => p.theme.colors.dark};
  border: none;
  background: none;
  outline: none;
  flex: 1;
  ${(p) => p.theme.typography[0]};
  margin-left: 0.375rem;
  ${above("sm")`
		margin-left: 0.5rem;
	`}
  &::placeholder {
    color: ${(p) => p.theme.colors.lightGrey};
  }
  &::selection {
    background: ${(p) => p.theme.colors.lightGrey};
    color: ${(p) => p.theme.colors.white};
  }
`;

const getPlaceholder = (kindURL) => {
  if (kindURL === "movies") return "movies";
  if (kindURL === "people") return "people";
  if (kindURL === "tv") return "tvshows";
  return "movies, tvshows or people";
};

/**
 * A search bar component that takes in a kindURL, value, onChange, and other props.
 * @param {string} kindURL - The URL of the kind of search being performed.
 * @param {string} value - The current value of the search bar.
 * @param {function} onChange - The function to call when the search bar value changes.
 * @param {object} props - Additional props to pass to the component.
 * @returns A search bar component with a loupe icon and input field.
 */
const Searchbar = ({ kindURL, value, onChange, ...props }) => (
  <Container {...props}>
    <Wrapper>
      <Loupe />
      <Input placeholder={`Search for ${getPlaceholder(kindURL)}...`} autoFocus={true} value={value} onChange={onChange} />
      {value && <i className="pi pi-times-circle" onClick={() => onChange({ target: { value: "" } })} style={{ zIndex: 2 }} />}
    </Wrapper>
  </Container>
);

export default Searchbar;
