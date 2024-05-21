import "../../styles/components/forms.scss";
import SearchIcon from "../../components/icons/SearchIcon";
import CloseSearchIcon from "../icons/CloseSearchIcon";

function SearchBar({ searchSetTracks, searchText }) {
  const handleSearchChange = (event) => {
    event.preventDefault();
    searchSetTracks(event.target.value);
  };

  return (
    <div className="search-bar-wrapper">
      <SearchIcon />
      <input
        type="text"
        placeholder="Search"
        value={searchText}
        onChange={handleSearchChange}
      />
      {searchText !== "" && (
        <span className="close-search-bar" onClick={() => searchSetTracks("")}>
          <CloseSearchIcon />
        </span>
      )}
    </div>
  );
}

export default SearchBar;
