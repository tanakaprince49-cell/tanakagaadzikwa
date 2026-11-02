/**
 * Compresses an image file client-side using HTML5 Canvas.
 * Scales down high-resolution images and converts them to JPEG/WEBP data URLs.
 */
export async function compressImageFile(
  file: File,
  maxDimension: number = 1200,
  quality: number = 0.82
): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const srcUrl = e.target?.result as string;
      if (!srcUrl) {
        return resolve('');
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate scaled dimensions while preserving aspect ratio
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(srcUrl); // Fallback to raw data URL
          }

          // Smooth rendering settings
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw image
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          console.warn('Canvas compression failed, using original data URL:', err);
          resolve(srcUrl);
        }
      };

      img.onerror = () => {
        resolve(srcUrl);
      };

      img.src = srcUrl;
    };

    reader.onerror = () => {
      resolve('');
    };

    reader.readAsDataURL(file);
  });
}
