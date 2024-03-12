import Loader from './Loader'
import GridPostList from './GridPostList'
type SearchResultProps = {
  isSearchFetching: boolean,
  searchedPosts: any,
}
const SearchResult = ({isSearchFetching, searchedPosts} : SearchResultProps) => {
  if (isSearchFetching) {
    return(<Loader children = '' />)
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  } else {
    return (
      <p className="w-full mt-10 text-center text-light-4">No results found</p>
    );
  }
}

export default SearchResult