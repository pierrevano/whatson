export const shouldSendCustomEvents = () => {
  const beamanalytics = localStorage.getItem("beamanalytics") || "true";
  return beamanalytics !== "false";
};
