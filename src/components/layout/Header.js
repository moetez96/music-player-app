import "../../styles/layout/header.scss";
import SearchBar from "../forms/SearchBar";
import Logo from "../icons/Logo";

function Header({searchText, searchSetTracks}) {
  return (
    <div className="header-wrapper">
      <Logo />
      <SearchBar searchText={searchText} searchSetTracks={searchSetTracks}/>
    </div>
  );
}

export default Header;
