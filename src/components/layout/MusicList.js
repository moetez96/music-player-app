import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to get current route
import "../../styles/layout/music_list.scss";
import ScanForMusic from "../buttons/ScanForMusic";
import UploadMusic from "../buttons/UploadMusic";
import MusicCard from "../cards/MusicCard";

function MusicList({ musicList }) {
    const location = useLocation();

    const isFavoritesRoute = location.pathname === "/favorites";

    return (
        <div className="music-list-wrapper">
            {!isFavoritesRoute && (
                <div className="upload-music-icons-container">
                    <UploadMusic />
                    <ScanForMusic />
                </div>
            )}
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
