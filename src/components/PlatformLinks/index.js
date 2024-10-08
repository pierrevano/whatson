import React from "react";
import styled from "styled-components";
import Text from "components/Text";
import Eye from "components/Icon/Eye";
import { shouldSendCustomEvents } from "utils/shouldSendCustomEvents";

const Wrapper = styled.button`
  background: none;
  border: none;
  display: inline-flex;
  color: currentColor;
  text-decoration: none;
  border-radius: 0.25rem;
  box-shadow: inset 0 0 0 1px ${(p) => p.theme.colors.midGrey};
  color: ${(p) => p.theme.colors.lightGrey};
  overflow: hidden;
  margin: 1rem 0.5rem;
  @media (max-width: 980px) {
    margin: 1rem 0.5rem 0 0.5rem;
  }
  cursor: pointer;
  &:hover {
    color: ${(p) => p.theme.colors.white};
    background: ${(p) => p.theme.colors.lightDark};
    box-shadow: inset 0 0 0 1px ${(p) => p.theme.colors.green};
  }
  &:focus {
    box-shadow: inset 0 0 0 0.125rem ${(p) => p.theme.colors.green};
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0.25rem;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.5rem 0.5rem 0;
`;

/**
 * A functional component that renders a clickable link to a platform.
 * @param {string} name - The name of the platform.
 * @param {string} linkURL - The URL of the platform.
 * @returns A clickable link to the platform.
 */
const PlatformLinks = ({ name, linkURL }) => {
  const handleClick = () => {
    if (shouldSendCustomEvents()) {
      window.beam(`/custom-events/platform_links_opened/${linkURL}`);
    }
    window.open(linkURL, "_blank", "noreferrer");
  };

  return (
    <Wrapper onClick={handleClick}>
      <Left>
        <Eye
          style={{ transform: "translateY(-1px)" }}
          size={16}
          strokeWidth={2.5}
        />
      </Left>
      <Right>
        <Text>{name}</Text>
      </Right>
    </Wrapper>
  );
};

export default PlatformLinks;
