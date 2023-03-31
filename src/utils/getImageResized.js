export const getImageResized = (kind, rawWidth, rawHeight, rawImage) => {
  const maxSize = 500;
  const compressionSize = 2;
  const width = !kind && rawWidth > maxSize ? parseInt(rawWidth / compressionSize) : rawWidth;
  const height = !kind && rawWidth > maxSize ? parseInt(rawHeight / compressionSize) : rawHeight;
  const image = !kind && rawImage && rawWidth > maxSize ? `${rawImage.split("net")[0]}net/c_${width}_${height}${rawImage.split("net")[1]}` : rawImage;

  return { width, height, image };
};
