import React from "react";
import UploadMusicIcon from "../icons/UploadMusicIcon";
import jsmediatags from "jsmediatags-web";
import { convertImageToBase64, getAudioBuffer } from "../../utils/Shared";
import {
  getAudioCover,
  saveAudioCoverToDB,
  saveTrackToDB,
} from "../../services/MusicDBService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UploadMusic() {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.type.startsWith("audio/")) {
      try {
        const arrayBuffer = await getAudioBuffer(file);

        const tag = await new Promise((resolve, reject) => {
          jsmediatags.read(file, {
            onSuccess: resolve,
            onError: reject,
          });
        });

        if (!tag || !tag.tags) {
          console.error("No tags found for the audio file.");
          return;
        }

        const cover = tag.tags.picture;
        console.log(tag.tags.genre);

        const track = {
          id: 0,
          title: tag.tags.title || "Unknown",
          artist: tag.tags.artist || "Unknown",
          album: tag.tags.album || "Unknown",
          duration: 0,
          urlId: null,
          addDate: Date.now(),
          selected: false,
          genre: tag.tags.genre || "Unknown",
          composer: tag.tags["©wrt"]?.data || "Unknown",
          releaseDate: tag.tags.year || "Unknown",
          copyright: tag.tags["cprt"]?.data || "Unknown"
        };

        const audio = new Audio();
        const url = URL.createObjectURL(file);
        audio.src = url;

        await new Promise((resolve, reject) => {
          audio.addEventListener("loadedmetadata", async function () {
            try {
              track.duration = audio.duration || 0;

              if (cover) {
                const coverPictureExists = await getAudioCover(track);
                if (!coverPictureExists) {
                  const coverPic = await convertImageToBase64(cover);
                  await saveAudioCoverToDB(track, coverPic);
                }
              }

              await saveTrackToDB(track, arrayBuffer);
              resolve();
            } catch (error) {
              reject(error);
            }
          });

          audio.load();
        });
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("An error occurred while processing the file.");
      }
    } else {
      console.error("Invalid file type. Please select an Audio file.");
      toast.error("Invalid file type. Please select an Audio file.");
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
