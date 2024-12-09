import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { colors } from "../../theme";
import config from "../../config";

const Wrapper = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const ProgressBar = styled.div`
  position: relative;
  width: 100px;
  height: 0.5rem;
  background-color: ${colors.dark};
  border-radius: 0.25rem;
  border: 1px solid ${colors.white};
  overflow: hidden;
  margin-top: 20px;
`;

const Progress = styled.div`
  height: 100%;
  background-color: ${colors.white};
  width: ${(props) => props.progress}%;
  transition: width 0.1s ease-in-out;
`;

const LoaderIcon = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress =
          prevProgress + (100 / config.loader_icon_duration_milliseconds) * 100;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Wrapper>
      <img
        src="https://whatson.onrender.com/logo.png"
        alt="Loading"
        width="100"
      />
      <ProgressBar>
        <Progress progress={progress} />
      </ProgressBar>
    </Wrapper>
  );
};

export default LoaderIcon;
