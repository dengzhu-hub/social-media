import { Models } from 'appwrite'
import React from 'react'
import Loader from './Loader'
import GridPostList from './GridPostList'
type SearchResultProps = {
  isSearchFetching: boolean,
  searchedPosts: Models.Document[]
}
const SearchResult = ({isSearchFetching, searchedPosts} : SearchResultProps) => {
  if (isSearchFetching) return <Loader children=''></Loader>
  if (searchedPosts && searchedPosts.documents.length > 0) {
    return (
      <GridPostList posts={searchedPosts.documents} />
    )
  }
  return (
    <p className='w-full mt-10 text-center text-light-4'>no result found</p>
  )
}

export default SearchResult