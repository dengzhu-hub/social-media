import GridPostList from '@/components/shared/GridPostList';
import SearchResult from '@/components/shared/SearchResult';
import { Input } from '@/components/ui/input'
import { filter, search } from '@/public/assets/icons'
import { useState, useEffect } from 'react'
import { useGetPosts, useSearchPosts } from '@/react-query/queriesAndMutation';
import useDebounce from '@/hooks/useDebounce';
import Loader from '@/components/shared/Loader';
import { useInView } from 'react-intersection-observer';
const Explore = () => {
  const {ref, inView} = useInView();
  const [searchValue, setSearchValue] = useState('');
  const debounceValue = useDebounce(searchValue, 500);
  const { data: posts, hasNextPage, fetchNextPage } = useGetPosts();
  const { data: searchResultPost, isFetching: isSearchFetching } = useSearchPosts(debounceValue);
  useEffect(() => {
    if (inView && !searchValue) fetchNextPage();
    
  }, [inView])
  if (!posts) {
    return (
      <div className='flex w-full h-full'>
        <Loader children='' />

      </div>
    )
  }
  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = !shouldShowSearchResults &&
    posts.pages.every((item) => item?.documents.length === 0);

  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h3 className='w-full capitalize h3-bold md:h2-bold'>
          search post
        </h3>
        <div className='flex w-full gap-1 pl-2 rounded-lg bg-dark-4 '>
          <img src={search} alt="search" width={24} height={24} className='cursor-pointer' />
          <Input type='text' placeholder='search post' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className='explore-search placeholder:text-xl'></Input>
        </div>

      </div>
      <div className='flex w-full max-w-5xl mt-16 mb-7 flex-between'>
        <h3 className='capitalize body-bold md:h3:bold'>
          popular today
        </h3>
        <div className='gap-2 px-4 py-3 cursor-pointer flex-center bg-dark-3 rounded-xl '>
          <p className='uppercase small-medium md:base-medium text-light-2'>all</p>
          <img src={filter} width={20} height={20} alt="filter post" />
        </div>


      </div>
      <div className='flex flex-wrap w-full max-w-5xl gap-9'>
        {shouldShowSearchResults ? (
          <SearchResult  isSearchFetching={isSearchFetching}  searchedPosts={searchResultPost} />
        ) : (
          shouldShowPosts ? (
            <p className='text-light-2'> end of post</p>
          ) : (
            posts.pages.map((item, index) => (
              <GridPostList posts={item.documents} key={`page-${index}`} />
            ))
          )
        )}
      </div>
      {hasNextPage && (
        <div className='' ref={ref}>
          <Loader children='hold on' />
        </div>
        
          
       
      )}

    </div>
  )
}

export default Explore