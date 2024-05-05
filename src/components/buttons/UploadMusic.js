import "../../styles/components/buttons.scss";
import UploadMusicIcon from "../icons/UploadMusicIcon";
import jsmediatags from "jsmediatags-web";

function UploadMusic() {
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.type.startsWith("audio/")) {
      const audio = new Audio();
      jsmediatags.read(file, {
        onSuccess(tag) {
          
          const url = URL.createObjectURL(file);
          audio.src = url;
          const track = {
            title: tag.tags.title || "Unknown",
            artist: tag.tags.artist || "Unknown",
            album: tag.tags.album || "Unknown",
            duration: 0,
            url: url,
            addDate: Date.now()
          };

          audio.addEventListener("loadedmetadata", function () {
            track.duration = audio.duration || 0;
            const musicList = JSON.parse(localStorage.getItem("musicList")) || [];
            musicList.push(track);
            localStorage.setItem("musicList", JSON.stringify(musicList));

            window.dispatchEvent(new Event("storage"));
          });
          audio.load();
        },
        onError(error) {
           // Handle error
          console.error("Error reading file metadata:", error);
        },
      });
    } else {
      console.error("Invalid file type. Please select an Audio file.");
    }
  };

  return (
    <>
      <input
        id="upload-music"
        type="file"
        accept="audio"
        onChange={handleFileChange}
        className="upload-music-button"
        hidden
      />
      <label htmlFor="upload-music" className="upload-button">
        <UploadMusicIcon />
        Upload Music
      </label>
    </>
  );
}

export default UploadMusic;
