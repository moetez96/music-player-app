export function formatDuration(duration) {
    if (!duration) {
      return "--:--";
    }
  
    var minutes = Math.floor(duration / 60);
    var remainingSeconds = Math.floor(duration % 60);
    return minutes + ":" + remainingSeconds;
}
