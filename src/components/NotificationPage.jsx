import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'

const NotificationPage = () => {
  const [notification, setNotification] = useState([]);
  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/get/notification`, { credentials: 'include' });
      const data = await res.json();
      setNotification(data);
      // console.log(data);
    }
    fetchNotifications();
  }, [])

  const handleAcceptRequest = async (userId) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/accept-request/${userId}`, { credentials: "include" });
    // console.log(res);
  }

  return (
    <div className="transition delay-150 ease-linear px-3 py-2 absolute h-72 w-[500px] bg-[#E1DFEA] z-50 translate-y-[50%] translate-x-[50%] left-[10%] rounded-xl shadow-xl overflow-hidden">
      <h1 className="my-1 text-center font-semibold text-gray-600">Notifications</h1>

      <div className="pb-10 h-full overflow-auto scroll-smooth">
        {notification ? notification?.map((notify) => (
          <div key={notify._id} className='mb-1 px-2 py-2 relative flex items-center bg-[#F1F1F1] rounded-md shadow-sm'>
            <div className='h-12 w-12'>
              <img className='h-full w-full object-cover rounded-full' src={notify.senderId.profileImage} alt="user" />
            </div>

            <div className='ml-3 flex flex-col justify-center items-start'>
              <p className=''>{notify.senderId.fullname}</p>
              {/* <p className='text-gray-500 text-sm'>@fir234</p> */}
            </div>
            <span className="ml-4 mr-2 text-gray-500 text-base">{notify.notification.notificationType === "follow-request" ? "follows you" : "accepted your request"}</span>
            <div className='absolute right-3'>
              {notify.notification.notificationType === "follow-request" ? <button onClick={() => handleAcceptRequest(notify.senderId._id)} className='px-4 py-1 bg-violet-500 rounded-md text-white shadow-xl'>accept</button> : ""}
              {/* <span className="ml-5"><FontAwesomeIcon className='hover:text-[#6c44fa] cursor-pointer' icon={faClose}/></span> */}
            </div>
          </div>
        )) : ""}


      </div>
    </div>
  )
}

export default NotificationPage