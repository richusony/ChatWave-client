import useScreen from '../Hooks/useScreen';
import { useEffect, useState } from 'react';
import { useSelectedChat } from '../context/SelectedChat';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddFrndToGroup = () => {
    const screenWidth = useScreen();
    const [friendsList, setFriendsList] = useState([]);
    const {selectedGroupId, setAddFrndToGrp} = useSelectedChat();
    const [groupMembers, setGroupMembers] = useState(sessionStorage.getItem("group-members"));
    const [groupData, setGroupData] = useState({
        groupId: selectedGroupId,
        members: sessionStorage.getItem("group-members").split(",")
    });
    useEffect(() => {
        getUserFriendList();
    }, []);

    const handleInput = (e) => {
        const { value } = e.target;
        setGroupData((prev) => ({
            ...prev,
            groupName: value
        }));
    };

    const getUserFriendList = async () => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/get/friends-list-group`, { credentials: "include" });
        const resData = await res.json();
        setFriendsList(resData);
    };

    const handleAddRemoveUsers = (userId) => {
        if (groupData.members.includes(userId)) {
            setGroupData((prev) => ({
                ...prev,
                members: prev.members.filter(id => id !== userId)
            }));
        } else {
            setGroupData((prev) => ({
                ...prev,
                members: [...prev.members, userId]
            }));
        }
    };

    const handleAddFriendsToGroup = async () => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/add-to-group`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(groupData),
        });

        if (res.status == 200) {
            const resData = await res.json();
            sessionStorage.setItem("group-members",groupData.members);
            setAddFrndToGrp(false);
        }
    }

    // Conditional rendering for friendsList
    const renderFriendsList = () => {
        if (!friendsList || friendsList.length === 0) {
            return <h1>No users Found</h1>;
        }

        return friendsList.map((person) => (
            <div key={person.friendId._id} className='mb-1 px-2 py-2 relative flex items-center bg-[#F1F1F1] rounded-md shadow-sm'>
                <div className='h-12 w-12'>
                    <img className='h-full w-full object-cover rounded-full' src={person.friendId.profileImage} alt={person.friendId.username} />
                </div>

                <div className='ml-3 flex flex-col justify-center items-start'>
                    <p className='font-semibold text-sm'>{screenWidth < 768 && person.friendId.fullname.length > 15 ? person.friendId.fullname.substring(0, 8) + "..." : person.friendId.fullname}</p>
                    <p className='text-gray-500 text-sm'>@{screenWidth < 768 && person.friendId.username.length > 10 ? person.friendId.username.substring(0, 8) : person.friendId.username}</p>
                </div>

                <div className='absolute right-3'>
                    {groupData.members.includes(person.friendId._id) ? (
                        <button className='px-4 py-1 bg-violet-500 rounded-md text-white shadow-xl' onClick={() => handleAddRemoveUsers(person.friendId._id)}>Remove</button>
                    ) : (
                        <button className='px-4 py-1 bg-violet-500 rounded-md text-white shadow-xl' onClick={() => handleAddRemoveUsers(person.friendId._id)}>Add</button>
                    )}
                </div>
            </div>
        ));
    };
    return (
        <div className='px-3 py-3 absolute md:translate-x-[50%] translate-y-[50%] h-96 w-full md:w-1/2 bg-[#E1DFEA] z-50 rounded-xl shadow-2xl overflow-hidden'>
            <div className='flex justify-end text-xl'><FontAwesomeIcon className='hover:text-[#6c44fa] cursor-pointer' onClick={() => setAddFrndToGrp(false)} icon={faClose} /></div>
            <h1 className='mt-1 font-semibold text-center'>Add friends</h1>
            <div className='mb-2 text-end'>
                <button onClick={handleAddFriendsToGroup} className='mr-2 py-1 px-4 rounded bg-[#6c44fa] text-white'>Confirm</button>
            </div>

            <div className='pb-32 h-full overflow-auto scroll-smooth'>
                {renderFriendsList()}
            </div>
        </div>
    );
};

export default AddFrndToGroup;
