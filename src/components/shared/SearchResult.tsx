import Loader from "./Loader";
import GridPostList from "./GridPostList";
type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: unknown;
};
const SearchResult = ({
  isSearchFetching,
  searchedPosts,
}: SearchResultProps) => {
  if (isSearchFetching) {
    return <Loader children="" />;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } else if (
    searchedPosts &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (searchedPosts as { documents: any }).documents.length > 0
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <GridPostList posts={(searchedPosts as { documents: any }).documents} />
    );
  } else {
    return (
      <p className="w-full mt-10 text-center text-light-4">No results found</p>
    );
  }
};

export default SearchResult;
