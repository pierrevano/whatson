import React from "react";
import styled from "styled-components";
import above from "utils/above";
import Text from "components/Text";

const getReleaseDate = (release_date) => release_date?.split("-")[0] || null;

const getRuntime = (runtime) => {
  if (!runtime) return null;
  const minutes = Math.round(Number(runtime) / 60);
  if (!minutes) return null;
  return `${minutes} min`;
};

const getSeasonsNumber = (seasons_number) =>
  seasons_number
    ? `${seasons_number} season${seasons_number > 1 ? "s" : ""}`
    : null;

const getStatus = (status) => {
  if (status) return status;
  return null;
};

const getHighlight = (certification) => {
  if (certification) return certification;
  return null;
};

const Wrapper = styled.div.attrs({ "data-testid": "meta-wrapper" })`
  display: flex;
  align-items: center;
`;

const SeparatedText = styled(Text)`
  color: ${(p) => p.theme.colors.lightGrey};
  span + span {
    &:before {
      content: " • ";
    }
  }
`;

const Rating = styled(Text)`
  background: ${(p) => p.theme.colors.lightGrey};
  color: ${(p) => p.theme.colors.dark};
  font-weight: 500;
  border-radius: 0.25rem;
  margin: 0 0.5rem;
  padding: 0.125rem 0.375rem;
  text-align: center;
  ${above("md")`
    margin: -0.25rem 0.5rem;
    padding: 0.375rem 0.5rem;
  `}
  ${above("xg")`
    margin: -0.125rem 0.5rem;
    padding: 0.5rem 0.675rem;
  `}
`;

/**
 * Displays the release year, runtime, season count, status, and certification
 * badge for the current entity shown in the detail view.
 * @param {Object} props Component props with render API values.
 * @param {?string} props.certification_from_render Age rating badge.
 * @param {?string} props.release_date_from_render ISO release date string.
 * @param {?number} props.runtime_from_render Runtime in seconds.
 * @param {?number} props.seasons_number_from_render Season count for TV shows.
 * @param {?string} props.status_from_render Production status label.
 * @returns {JSX.Element} Inline metadata row.
 */
const Meta = ({
  certification_from_render: certificationFromRender,
  release_date_from_render: releaseDateFromRender,
  runtime_from_render: runtimeFromRender,
  seasons_number_from_render: seasonsNumberFromRender,
  status_from_render: statusFromRender,
}) => {
  const certificationValue = getHighlight(certificationFromRender);
  const releaseDateValue = getReleaseDate(releaseDateFromRender);
  const runtimeValue = getRuntime(runtimeFromRender);
  const seasonsValue = getSeasonsNumber(seasonsNumberFromRender);
  const statusValue = getStatus(statusFromRender);
  const hasInlineMeta =
    releaseDateValue || runtimeValue || seasonsValue || statusValue;
  const hasMeta = hasInlineMeta || certificationValue;

  if (!hasMeta) return null;

  return (
    <Wrapper style={{ margin: "1.5rem 0" }}>
      <SeparatedText sm={1}>
        {releaseDateValue && <span>{releaseDateValue}</span>}
        {runtimeValue && <span>{runtimeValue}</span>}
        {seasonsValue && <span>{seasonsValue}</span>}
        {statusValue && <span>{statusValue}</span>}
        {hasInlineMeta && certificationValue && <span />}
      </SeparatedText>
      {certificationValue && <Rating>{certificationValue}</Rating>}
    </Wrapper>
  );
};

export default Meta;
