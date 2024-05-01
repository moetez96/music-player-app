import "../../styles/layout/music_list.scss"
import ScanForMusic from "../buttons/ScanForMusic";
import UploadMusic from "../buttons/UploadMusic";
import MusicCard from "../cards/MusicCard";

function MusicList({ musicList }) {

    return (
        <div className="music-list-wrapper">
            <div className="upload-music-icons-container">
                <UploadMusic />
                <ScanForMusic />
            </div>
            {musicList.length === 0 ? (<></>) : (
                <>
                    {musicList.map((musicItem, index) => (
                        <MusicCard key={index} musicItem={musicItem} />
                    ))}
                </>
            )}
        </div>
    );
}

export default MusicList;
