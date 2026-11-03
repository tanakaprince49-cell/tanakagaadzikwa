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

/**
 * Center-crops an image to a fixed aspect ratio (e.g. 16:9 for blog covers) so
 * covers are always perfectly sized even if the user never opens the cropper.
 */
export async function cropImageToAspect(
  srcUrl: string,
  aspect: number = 16 / 9,
  maxWidth: number = 1600,
  quality: number = 0.9
): Promise<string> {
  return new Promise((resolve) => {
    if (!srcUrl) return resolve('');
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) return resolve(srcUrl);

        const srcAspect = w / h;
        let sourceWidth = w;
        let sourceHeight = h;
        let sourceX = 0;
        let sourceY = 0;

        if (srcAspect > aspect) {
          sourceWidth = Math.round(h * aspect);
          sourceX = Math.round((w - sourceWidth) / 2);
        } else {
          sourceHeight = Math.round(w / aspect);
          sourceY = Math.round((h - sourceHeight) / 2);
        }

        const outputWidth = Math.min(maxWidth, sourceWidth);
        const outputHeight = Math.max(1, Math.round(outputWidth / aspect));

        const canvas = document.createElement('canvas');
        canvas.width = outputWidth;
        canvas.height = outputHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(srcUrl);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, outputWidth, outputHeight);

        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch (err) {
        console.warn('Aspect crop failed, keeping original image:', err);
        resolve(srcUrl);
      }
    };

    img.onerror = () => resolve(srcUrl);
    img.src = srcUrl;
  });
}
