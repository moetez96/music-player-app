export function formatDuration(duration) {
    if (!duration) {
      return "--:--";
    }
  
    var minutes = Math.floor(duration / 60);
    var remainingSeconds = Math.floor(duration % 60);
    return minutes + ":" + remainingSeconds;
}

export async function convertImageToBase64(picture) {
  const maxFileSizeKB = 500;

  const createImage = (picture) => {
    return new Promise((resolve, reject) => {
      const blob = new Blob([new Uint8Array(picture.data)], { type: picture.format });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (error) => {
        URL.revokeObjectURL(url);
        reject(error);
      };
      img.src = url;
    });
  };

  const img = await createImage(picture);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let width = img.width;
  let height = img.height;

  const maxDimension = Math.max(width, height);
  const scale = Math.sqrt((maxFileSizeKB * 1024) / (maxDimension * maxDimension));
  width *= scale;
  height *= scale;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img, 0, 0, width, height);

  let quality = 1.0;
  let base64String;

  do {
    base64String = canvas.toDataURL(picture.format, quality);
    quality -= 0.1;
  } while (base64String.length > maxFileSizeKB * 1024 && quality > 0);

  console.log(base64String);
  return base64String;
}

export async function getAudioBuffer(file) {

  const arrayBuffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
  });

  return arrayBuffer;
}
