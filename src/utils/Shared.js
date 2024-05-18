export function formatDuration(duration) {
    if (!duration) {
      return "--:--";
    }
  
    var minutes = Math.floor(duration / 60);
    var remainingSeconds = Math.floor(duration % 60);
    return minutes + ":" + remainingSeconds;
}

export function convertImageToBase64(picture)  {
  var base64String = "";
  for (var i = 0; i < picture.data.length; i++) {
    base64String += String.fromCharCode(picture.data[i]);
  }
  var imageUri =
    "data:" + picture.format + ";base64," + window.btoa(base64String);

  return imageUri
}