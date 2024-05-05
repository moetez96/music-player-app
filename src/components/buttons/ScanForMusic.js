import { useState } from "react";
import ScanForMusicIcon from "../icons/ScanForMusicIcon";
import jsmediatags from "jsmediatags-web";

function ScanForMusic() {
  const [tracks, setTracks] = useState([]);

  const handleFileChange = async (event) => {
    const fileList = event.target.files;
    const fileListArray = Array.from(fileList);

    const promises = fileListArray.map(async (file) => {
      if (file.type.startsWith("audio/")) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = async (e) => {
            try {
              const tag = await new Promise((resolve, reject) => {
                jsmediatags.read(file, {
                  onSuccess: resolve,
                  onError: reject,
                });
              });
              const audio = new Audio();
              const url = URL.createObjectURL(file);
              audio.src = url;

              const track = {
                title: tag.tags.title || "Unknown",
                artist: tag.tags.artist || "Unknown",
                album: tag.tags.album || "Unknown",
                duration: 0,
                url,
                addDate: Date.now(),
              };

              audio.addEventListener("loadedmetadata", function () {
                track.duration = audio.duration || 0;
                resolve(track);
              });

              audio.load();
            } catch (error) {
              console.error("Error reading file metadata:", error);
              resolve(null);
            }
          };
          reader.readAsDataURL(file);
        });
      } else {
        return null;
      }
    });

    const processedTracks = await Promise.all(promises);
    const filteredTracks = processedTracks.filter((track) => track !== null);
    setTracks([...tracks, ...filteredTracks]);
    const musicList = JSON.parse(localStorage.getItem("musicList")) || [];
    musicList.push(...filteredTracks);
    localStorage.setItem("musicList", JSON.stringify(musicList));
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <>
      <div>
        <input
          type="file"
          id="scan-music"
          directory=""
          webkitdirectory=""
          multiple
          onChange={handleFileChange}
        />
      </div>
      <label htmlFor="scan-music" className="upload-button">
        <ScanForMusicIcon />
        Scan your device for music
      </label>
    </>
  );
}

export default ScanForMusic;
