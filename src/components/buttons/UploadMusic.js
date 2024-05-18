import React from "react";
import UploadMusicIcon from "../icons/UploadMusicIcon";
import jsmediatags from "jsmediatags-web";
import { convertImageToBase64 } from "../../utils/Shared";
import { saveTrackToDB } from "../../services/MusicDBService";

function UploadMusic() {

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.type.startsWith("audio/")) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        jsmediatags.read(file, {
          onSuccess(tag) {
            if (!tag || !tag.tags) {
              console.error("No tags found for the audio file.");
              return;
            }


            var picture = tag.tags.picture;
            const imageUri = convertImageToBase64(picture)
            
            const track = {
              id: 0,
              title: tag.tags.title || "Unknown",
              artist: tag.tags.artist || "Unknown",
              album: tag.tags.album || "Unknown",
              duration: 0,
              urlId: null,
              addDate: Date.now(),
              selected: false,
              image: imageUri
            };

            const audio = new Audio();
            const url = URL.createObjectURL(file);
            audio.src = url;

            audio.addEventListener("loadedmetadata", async function () {
              track.duration = audio.duration || 0;
              await saveTrackToDB(track, arrayBuffer);
            });

            audio.load();
          },
          onError(error) {
            console.error("Error reading file metadata:", error);
          },
        });
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
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
        <span>Upload Music</span>
      </label>
    </>
  );
}

export default UploadMusic;
