// Resize images in the browser before uploading them (Canvas API)

// Read the file
export async function readImage(file: File) {
  try {
    return await createImageBitmap(file);
  } catch {
    throw new Error(
      'Das Bild konnte nicht gelesen werden. Bitte JPG, PNG oder WebP verwenden.',
    );
  }
}

const toBlob = (canvas: HTMLCanvasElement, type: string) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.8));

// Resize to the given width (keeps the aspect ratio) and export as WebP.
// Safari can't encode WebP and returns PNG instead; in that case we use JPEG.
export async function resizeImage(bitmap: ImageBitmap, width: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = Math.round((bitmap.height * width) / bitmap.width);

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Das Bild konnte nicht verarbeitet werden.');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const webp = await toBlob(canvas, 'image/webp');
  const blob =
    webp?.type === 'image/webp' ? webp : await toBlob(canvas, 'image/jpeg');
  if (!blob) throw new Error('Das Bild konnte nicht verarbeitet werden.');
  return blob;
}
