import React, { useState } from 'react';
import chatIcon from "../assets/chat.png";
import toast from 'react-hot-toast';
import { createRoomApi, joinChatApi } from '../service/RoomService';
import useChatContext from '../context/ChatContext';
import { useNavigate, useRoutes } from 'react-router';

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const { roomId,userName,setRoomId,setCurrentUser,setConnected }=useChatContext()
   const navigate =  useNavigate();
  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    })
  }

  function validateForm() {
    if(detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid inputs")
      return false;
    }
    return true;
  }

 async function joinChat() {
    if(validateForm()) {
      // join chat
      
      try {
      const room =  await joinChatApi(detail.roomId)
      toast.success("Joined..")
      setCurrentUser(detail.userName);
      setRoomId(room.roomId);
      setConnected(true);
      navigate("/chat");

      }catch(error) {
        if(error.status == 400){
          toast.error(error.response.data)
        } else {
          toast.error("Error occured");
        }
       
        console.log(error)
      }
    }
  }

 async function createRoom () {

    if(validateForm()) {
      // Create Room
      console.log(detail)
      // call api to create room on backend
      try{
     const response = await createRoomApi(detail.roomId)
     console.log(response)
     toast.success("Room created successfully")
   
     // join the room
     setCurrentUser(detail.userName);
     setRoomId(response.roomId);
     setConnected(true)

     navigate("/chat")
     
    //  forward to chat page
     joinChat();
      }catch (error) {
         console.log(error);
         if(error.status == 400) {
          toast.error("Room already exists");
         }else {
          console.log("Error in creating room")
         }


         console.log("Error in creating room")
      }
    }
    const roomId = detail.roomId;
  }


  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <img 
            src={chatIcon} 
            alt="Chat Icon" 
            className="w-20 h-20 object-contain shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),2px_2px_5px_rgba(255,255,255,0.7)] rounded-lg"
          />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center mb-6">
          Join or Create
        </h1>
        <div className="space-y-4">
          <input 
            onChange={handleFormInputChange}
            value={detail.userName}
            type="text" 
            id='name'
            name='userName'
            placeholder="Enter your Name"
            className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-800 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] focus:ring-2 focus:outline-none dark:focus:ring-blue-400"
          />
          <input 
           onChange={handleFormInputChange}
           value={detail.roomId}
            type="text" 
            id='name'
            name='roomId'
            placeholder="Enter Room ID"
            className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-800 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] focus:ring-2 focus:outline-none dark:focus:ring-blue-400"
          />
          <div className="flex gap-3">
            <button onClick={joinChat} className="flex-1 p-3 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-[2px_2px_5px_rgba(0,0,0,0.2)] hover:bg-gray-400 hover:dark:bg-gray-500 transition-all">
              Join
            </button>
            <button onClick={createRoom} className="flex-1 p-3 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-[2px_2px_5px_rgba(0,0,0,0.2)] hover:bg-gray-400 hover:dark:bg-gray-500 transition-all">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;