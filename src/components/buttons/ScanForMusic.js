import React from "react";
import ScanForMusicIcon from "../icons/ScanForMusicIcon";
import jsmediatags from "jsmediatags-web";
import {
  getAudioCover,
  saveAudioCoverToDB,
  saveTrackToDBScan,
} from "../../services/MusicDBService";
import { convertImageToBase64, getAudioBuffer } from "../../utils/Shared";
import { toast } from "react-toastify";

function ScanForMusic() {
  const handleFileChange = async (event) => {
    const fileList = event.target.files;
    const fileListArray = Array.from(fileList);

    const processFile = async (file) => {
      if (file.type.startsWith("audio/")) {
        const audio = new Audio();
        try {
          const tag = await new Promise((resolve, reject) => {
            jsmediatags.read(file, {
              onSuccess: resolve,
              onError: reject,
            });
          });

          const arrayBuffer = await getAudioBuffer(file);
          const cover = tag.tags.picture;
          console.log(tag.tags);
          const track = {
            id: 0,
            title: tag.tags.title || "Unknown",
            artist: tag.tags.artist || "Unknown",
            album: tag.tags.album || "Unknown",
            duration: 0,
            urlId: arrayBuffer,
            addDate: Date.now(),
            selected: false,
            genre: tag.tags.genre || "Unknown",
            composer: tag.tags["©wrt"]?.data || "Unknown",
            releaseDate: tag.tags.year || "Unknown",
            copyright: tag.tags["cprt"]?.data || "Unknown"
          };

          return new Promise((resolve, reject) => {
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

                const result = await saveTrackToDBScan(track);
                resolve(result !== null);
              } catch (error) {
                reject(false);
              }
            });

            audio.src = URL.createObjectURL(file);
            audio.load();
          });
        } catch (error) {
          console.error("Error processing file:", error);
          return false;
        }
      }
    };

    const processFiles = async () => {
      let addedCount = 0;
      let rejectedCount = 0;

      for (const file of fileListArray) {
        const result = await processFile(file);
        if (result) {
          addedCount++;
        } else {
          rejectedCount++;
        }
      }

      return { addedCount, rejectedCount };
    };

    const promise = processFiles();

    toast.promise(
        promise,
        {
          pending: 'Scanning and processing files...',
        }
    ).then(({ addedCount, rejectedCount }) => {
      console.log("Promise resolved!");
      toast(`Scan complete! Added tracks: ${addedCount}, Rejected files: ${rejectedCount}`);
    });
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
          <span>Scan your device for music</span>
        </label>
      </>
  );
}

export default ScanForMusic;
