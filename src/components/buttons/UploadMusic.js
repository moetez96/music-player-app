import "../../styles/components/buttons.scss"
import UploadMusicIcon from "../icons/UploadMusicIcon";

function UploadMusic() {

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
      <label for="upload-music" className="upload-button"><UploadMusicIcon/>Upload Music</label>
    </>
  );
}

export default UploadMusic;
