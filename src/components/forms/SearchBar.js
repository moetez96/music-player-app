import '../../styles/components/forms.scss';
import SearchIcon from '../../components/icons/SearchIcon';

function SearchBar({searchSetTracks, searchText}) {

  const handleSearchChange = (event) => {
    event.preventDefault();
    searchSetTracks(event.target.value);
  }

  return (
    <div className="search-bar-wrapper">
      <SearchIcon/>
      <input type="text" placeholder="Search" value={searchText} onChange={handleSearchChange}/>
    </div>
  );
}

export default SearchBar;
