import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { useMenuContext } from '../context/MenuContext';
import { useSelectedChat } from '../context/SelectedChat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGear, faMessage, faPlusCircle, faPowerOff, faUsers } from '@fortawesome/free-solid-svg-icons'
import useScreen from '../Hooks/useScreen';

const MenuBar = () => {
    const { logOut } = UserAuth();
    const navigate = useNavigate();
    const screenWidth = useScreen();
    const { setNewGroupPage } = useSelectedChat();
    const { setMenuBar, groupsPage, setGroupsPage } = useMenuContext();

    const handleLogOut = async (e) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/auth/logout`, { withCredentials: true });
            await logOut();

            sessionStorage.removeItem("login-user");
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={`${screenWidth < 768 ? groupsPage?"hidden":"" : ""} transition delay-150 ease-linear w-full md:w-1/3 h-screen bg-[#FFFFFF] dark:bg-[#424769]  py-4 px-3 overflow-hidden`}>
            <h1 className='mb-5 text-start'><FontAwesomeIcon className="text-2xl text-gray-600 hover:text-[#6c44fa] dark:text-gray-800 dark:hover:text-[#6c44fa] cursor-pointer" onClick={() => setMenuBar(false)} icon={faArrowLeft} /></h1>
            <div className='py-4 bg-[#E8E8F9] flex justify-center items-center rounded-xl shadow-xl'>
                <h1 className='text-2xl font-bold'>Chat<span className='text-[#6c44fa]'>Wave</span></h1>
            </div>

            <div className='mt-8'>
                <div onClick={()=> {setNewGroupPage(false); screenWidth < 768 ? setMenuBar(false) : null; navigate("/");}} className='mb-3 px-2 py-2 rounded border-l-4 border-transparent hover:border-[#6c44fa] hover:text-[#6c44fa] cursor-pointer'>
                    <span className='flex items-center'><FontAwesomeIcon icon={faMessage} /> <h1 className='ml-3 text-lg font-semibold'>Chats</h1></span>
                </div>
                <div onClick={()=> setNewGroupPage(true)} className='mb-3 px-2 py-2 rounded border-l-4 border-transparent hover:border-[#6c44fa] hover:text-[#6c44fa] cursor-pointer'>
                    <span className='flex items-center'><FontAwesomeIcon icon={faPlusCircle} /> <h1 className='ml-3 text-lg font-semibold'>New Group</h1></span>
                </div>
                <div onClick={()=> {setGroupsPage(true);}} className='mb-3 px-2 py-2 rounded border-l-4 border-transparent hover:border-[#6c44fa] hover:text-[#6c44fa] cursor-pointer'>
                    <span className='flex items-center'><FontAwesomeIcon icon={faUsers} /> <h1 className='ml-3 text-lg font-semibold'>Groups</h1></span>
                </div>
                <div onClick={handleLogOut} className='mb-3 px-2 py-2 rounded border-l-4 border-transparent hover:border-[#6c44fa] hover:text-[#6c44fa] cursor-pointer'>
                    <span className='flex items-center'><FontAwesomeIcon icon={faPowerOff} /> <h1 className='ml-3 text-lg font-semibold'>Logout</h1></span>
                </div>
                <div className='mb-3 px-2 py-2 rounded border-l-4 border-transparent hover:border-[#6c44fa] hover:text-[#6c44fa] cursor-pointer'>
                    <span className='flex items-center'><FontAwesomeIcon icon={faGear} /> <h1 className='ml-3 text-lg font-semibold'>Settings</h1></span>
                </div>
            </div>
        </div>
    )
}

export default MenuBar