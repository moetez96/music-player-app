import "../../styles/layout/header.scss";
import SearchCard from "../cards/SearchCard";
import SearchBar from "../forms/SearchBar";
import Logo from "../icons/Logo";

function Header({ musicList, searchText, searchSetTracks }) {
  
  return (
    <div className="header-wrapper">
      <Logo />
      <SearchBar searchText={searchText} searchSetTracks={searchSetTracks} />
      {searchText !== "" && (
        <div className="search-result-wrapper">
          {musicList?.length !== 0 ? (
            <>
            <p>Found: {musicList?.length}</p>
              {musicList?.map((musicItem) => (
                <SearchCard musicItem={musicItem} />
              ))}
            </>
          ) : (
            <p>No tracks found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Header;
