import ScanForMusicIcon from "../icons/ScanForMusicIcon";

function ScanForMusic() {
    const handleFileChange = (event) => {
        
      };
  return (
    <>
      <input
        id="upload-music"
        type="file"
        accept="audio/mp3"
        onChange={handleFileChange}
        className="upload-music-button"
        hidden
      />
      <label for="upload-music" className="upload-button">
        <ScanForMusicIcon/>Scan your device for music</label>
    </>
  );
}

export default ScanForMusic;