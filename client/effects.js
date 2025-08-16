// Function to shift RGB channels (Chromatic Aberration)
export function applyChromaticAberration(data) {
  for (let i = 0; i < data.length; i += 4) {
    // Shift red channel left by a few pixels
    data[i] = data[i - 4] || data[i]; // Red channel
    // Shift blue channel right by a few pixels
    data[i + 2] = data[i + 6] || data[i + 2]; // Blue channel
  }
  return data;
}

// Function to add random noise
export function applyNoise(data) {
  for (let i = 0; i < data.length; i += 4) {
    const noise = 100; // Random noise value
    data[i] += (Math.random() - 0.5) * noise; // Red
    data[i + 1] += (Math.random() - 0.5) * noise; // Green
    data[i + 2] += (Math.random() - 0.5) * noise; // Blue
  }
  return data;
}

// Function to apply scanlines (modify imageData directly)
export function applyScanlines(
  data,
  width,
  height,
  lineDiff = 4,
  LineHeight = 2,
  opacity = 0.4
) {
  //   const data = imageData.data;

  // Calculate the number of scanlines
  const scanlineOpacity = opacity * 255; // Convert opacity to 0-255 range

  for (let i = 0; i < height; i += lineDiff) {
    for (let j = 0; j < width; j++) {
      for (let k = 0; k < LineHeight; k++) {
        // Modify every pixel in the scanline area to black (or semi-transparent black)
        const index = ((i+k) * width + j) * 4;
        //   console.log(index);

        data[index] += 0; // Red channel
        data[index + 1] += 20; // Green channel
        data[index + 2] += 20; // Blue channel
        data[index + 3] += scanlineOpacity; // Alpha channel (opacity of scanline)
      }
    }
  }
  return data;
}
