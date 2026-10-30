// Bilder im Browser verkleinern, bevor sie hochgeladen werden (Canvas-API)

// Datei einlesen
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

// Auf die gewünschte Breite verkleinern (Seitenverhältnis bleibt) und als WebP exportieren.
// Safari kann kein WebP erzeugen und liefert dann PNG; in dem Fall nehmen wir JPEG.
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
