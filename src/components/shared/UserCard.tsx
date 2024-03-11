import { profile } from '@/public/assets/icons'
import { Models } from 'appwrite'
import { Link } from 'react-router-dom'
type UserCardProps = {
    user:Models.Document,
}
const UserCard = ({user}:UserCardProps) => {
  return (
    <Link className='user-card' to={`/profile/${user?.$id}`}>
        <img src={user?.imageUrl || profile} alt="creator"  className='rounded-full w-14 h-14'/>
        <div>
            <p>{user?.name}</p>
            <p>@{user?.username}</p>
        </div>

    </Link>
  )
}

export default UserCard