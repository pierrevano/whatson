import React, { useEffect } from "react";
import styled from "styled-components";
import Container from "components/Container";
import Text from "components/Text";
import { shouldSendCustomEvents } from "utils/shouldSendCustomEvents";

const Wrapper = styled(Container)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 4rem auto;
  text-align: center;
  svg {
    color: ${(p) => p.theme.colors.grey};
  }
`;

const Emoji = styled.div`
  font-size: 3rem;
  margin: 0.5em;
`;

const InfoText = styled(Text)`
  color: ${(props) => props.theme.colors.lightGrey};
`;

/**
 * A component that displays information in a styled wrapper.
 * @param {string} emoji - The emoji to display in the component.
 * @param {string} title - The title to display in the component.
 * @param {string} description - The description to display in the component.
 * @param {object} props - Additional props to pass to the component.
 * @returns A styled wrapper component that displays the given information.
 */
const InfoScreen = ({ emoji, title, description, ...props }) => {
  useEffect(() => {
    if (shouldSendCustomEvents()) {
      window.beam(`/custom-events/info_screen_displayed/${title}`);
    }
  }, [title]);

  return (
    <Wrapper {...props}>
      {emoji && <Emoji>{emoji}</Emoji>}
      {title && (
        <Text xs={1} md={2} weight={600} style={{ margin: "1rem 0 0.5rem" }}>
          {title}
        </Text>
      )}
      {description && <InfoText>{description}</InfoText>}
    </Wrapper>
  );
};

export default InfoScreen;
