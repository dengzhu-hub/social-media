import { users } from '@/public/assets/icons'
import React from 'react'
import { useToast } from '@/components/ui/use-toast';
import { useGetUsers } from '@/react-query/queriesAndMutation';
import Loader from '@/components/shared/Loader';
import { IUser } from '@/types';
import { Models } from 'appwrite';
import UserCard from '@/components/shared/UserCard';

const AllUsers = () => {
  const {toast} = useToast();
  const {data:creators, isLoading, isError:isErrorCreator} = useGetUsers();
  if (isErrorCreator)  {
    toast({
      title: "Error fetching data",
      description: "There was an error fetching data",
    })
    return;
    
    
  }
  return (
    <div className='common-container'>
    <div className='user-container'>
      <div className='gap-2 flex-center'>
        <img  className='w-6 h-6 ' src={users} alt="all-users" />
        <h3 className='capitalize h3-bold'>all users</h3>
      </div>
      {isLoading && !creators ? (<Loader children=''/>) : (
        <ul className='user-grid'>
          {creators?.documents?.map((creator) => (
            <li key={creator?.$id}>
              < UserCard user={creator}/>
            </li>
          ))}
          
        </ul>
      )}
      

    </div>
    </div>
  )
}

export default AllUsers