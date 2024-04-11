import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react'
import { useSelectedChat } from '../context/SelectedChat';
import { useLoggedInUser } from '../context/LoggedInUserCnxtProvider';
import useScreen from '../Hooks/useScreen';

const FindUserPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const {user} = useLoggedInUser();
  const screenWidth = useScreen();
  const [friendsList, setFriendsList] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const {setOpenWindow, setSelectedId} = useSelectedChat()
  useEffect(()=>{
    const searchUser =  async () => {
      if(searchInput == "") return setUsersData([]);
      const reqData = {
        search: searchInput.trim()
      }
      const res = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/search-user`,{
      method:'POST',
      headers: {
      "Content-Type": "application/json",
      },
      credentials:"include",
      body: JSON.stringify(reqData)
    })

    if (res.status == 200) {
      const data = await res.json();
      // console.log([...data]);
      setUsersData([...data]);
    }
    }
searchUser();
getUserFriendList();
  },[searchInput])

  const getUserFriendList = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/get/friends-list`,{credentials:"include"})
    const resData = await res.json();
    setFriendsList(resData);
  }

const handleFollowUser = async (userId) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/follow-request/${userId}`,{credentials:"include"})
  console.log(res);
  if(res.status == 201) {
    getUserFriendList();
  }
}
  return (
    <div className='px-3 py-3 translate-y-[50%] md:translate-x-[50%] absolute h-80 w-full md:w-1/2 bg-[#E1DFEA] z-50 rounded-xl shadow-2xl overflow-hidden'>
      <div className='flex justify-end text-xl'><FontAwesomeIcon className='hover:text-[#6c44fa] cursor-pointer' onClick={()=>setOpenWindow(false)} icon={faClose}/></div>
      <form>
        <input type="text" value={searchInput} onChange={(e)=>setSearchInput(e.target.value)} placeholder='Search Users' className='py-1 w-full bg-transparent outline-none border-b-2 border-violet-600' />
      </form>

      <div className='pb-12 h-full overflow-auto scroll-smooth'>
        {usersData? usersData.map((person)=>(
      <div key={person._id} className='mb-1 px-2 py-2 relative flex items-center bg-[#F1F1F1] rounded-md shadow-sm'>
          <div className='h-12 w-12'>
              <img className='h-full w-full object-cover rounded-full' src={person.profileImage} alt="person" />
          </div>

          <div className='ml-3 flex flex-col justify-center items-start'>
            <p className='font-semibold text-sm'>{screenWidth < 768 && person.fullname.length > 15 ? person.fullname.substring(0,8) + "..." : person.fullname}</p>
            <p className='text-gray-500 text-sm'>@{screenWidth < 768 && person.username.length > 10 ? person.username.substring(0,8):person.username }</p>
          </div>

          {friendsList && (
        <div className='absolute right-3'>
          {friendsList?.some((usr) => usr.friendId === person._id) ? (
            friendsList.find((usr) => usr.friendId === person._id && usr.status) ? (
              <button className='px-4 py-1 bg-violet-500 rounded-md text-white shadow-xl' onClick={() => setSelectedId(person._id)}>message</button>
            ) : (
              <button className='px-4 py-1 bg-violet-500 rounded-md text-white shadow-xl'>pending</button>
            )
          ) : (
            <button className='px-4 py-1 bg-violet-500 rounded-md text-white shadow-xl' onClick={() => handleFollowUser(person._id)}>follow</button>
          )}
        </div>
      )}
      </div>
        )):<><h1>No users Found</h1></>
        }
      </div>

    </div>
  )
}

export default FindUserPage