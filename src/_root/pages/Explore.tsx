import { Input } from '@/components/ui/input'
import { filter, search } from '@/public/assets/icons'
import { useState } from 'react'

const Explore = () => {
  const [searchValue, setSearchValue] = useState('');
  const post: string[] = [];
  const shouldShowSearchResult = searchValue !== '';
  const shouldShowPosts = !shouldShowSearchResult && post?.page.every(item => item.documents.length === 0);
  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h3 className='h3-bold md:h2-bold w-full capitalize'>
          search post
        </h3>
        <div className='flex gap1 bg-dark-4 w-full rounded-lg pl-2 '>
          <img src={search} alt="search" width={24} height={24} className='cursor-pointer' />
          <Input type='text' placeholder='search post' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className='explore-search placeholder:text-xl'></Input>
        </div>

      </div>
      <div className='flex mt-16 mb-7 justify-between w-full max-w-5xl'>
        <h3 className='capitalize body-bold md:h3:bold'>
          popular today
        </h3>
        <div className='flex-center gap-2 cursor-pointer bg-dark-3 px-4 py-3 rounded-xl '>
          <p className='small-medium md:base-medium uppercase text-light-2'>all</p>
          <img src={filter} width={20} height={20} alt="filter post" />
        </div>

        <div className='flex flex-wrap gap-9 max-w-5xl  w-full'>
          {shouldShowSearchResult ? (
            <SearchResult ></SearchResult>
          ) : shouldShowPosts ? (
            <p className='text-light-4 mt-10 text-center w-full'>
              end of post
            </p>
          ) : post.pages.map((item, index) => (
            <GridPostList></GridPostList>
          ))

          }

        </div>
      </div>

    </div>
  )
}

export default Explore