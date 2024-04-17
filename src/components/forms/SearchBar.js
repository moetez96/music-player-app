import '../../styles/components/forms.scss';
import SearchIcon from '../../components/icons/SearchIcon';

function SearchBar() {
  return (
    <div className="search-bar-wrapper">
      <SearchIcon/>
      <input type="text" placeholder="Search"/>
    </div>
  );
}

export default SearchBar;
