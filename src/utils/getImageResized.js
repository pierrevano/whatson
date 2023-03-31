export const getImageResized = (kind, rawWidth, rawHeight, rawImage) => {
  const maxSize = 500;
  const compressionSize = 2;
  const tmdbBaseURL = "https://image.tmdb.org";
  const width = rawImage && !rawImage.startsWith(tmdbBaseURL) && rawWidth > maxSize && !kind ? parseInt(rawWidth / compressionSize) : rawWidth;
  const height = rawImage && !rawImage.startsWith(tmdbBaseURL) && rawWidth > maxSize && !kind ? parseInt(rawHeight / compressionSize) : rawHeight;
  const image = rawImage && !rawImage.startsWith(tmdbBaseURL) && rawImage && rawWidth > maxSize && !kind ? `${rawImage.split("net")[0]}net/c_${width}_${height}${rawImage.split("net")[1]}` : rawImage;

  return { width, height, image };
};
