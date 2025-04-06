import React, { useEffect, useRef, useState } from 'react';
import { MdAttachFile, MdSend } from 'react-icons/md';
import chatBg from '../assets/ChatGPT.png';
import  useChatContext  from "../context/ChatContext"; 
import { useNavigate } from 'react-router';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import {baseURL} from '../config/AxiosHelper'
import { getMessages } from '../service/RoomService';
import { timeAgo } from '../config/Helper';


const ChatPage = () => {

const {roomId,currentUser,connected,setConnected,setRoomId,setCurrentUser} = useChatContext();
// console.log(roomId);
// console.log(currentUser);
// console.log(connected);
const navigate = useNavigate()
useEffect(() =>{
  if(!connected){
    navigate("/")
  }
},[connected,roomId,currentUser]);

  const [messages,setMessages] = useState([
    
    
    
  ]);
  const [input,setInput] = useState("")
  const inputRef = useRef(null)
  const chatBoxRef = useRef(null)
  const [stompClient,setStompClient] = useState("")

  //page init
  // to load messages
  

  useEffect(() => {
     async function loadMessages() {
      try {
        const messages = await getMessages(roomId);
        console.log(messages);
        setMessages(messages)
      } catch (error) {}
     }
     if(connected){
     loadMessages();
     }
  }, []);

  //scroll down

  useEffect(() => {
    if(chatBoxRef.current) {
      chatBoxRef.current.scroll({
      top:chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }
}, [messages]);


  //StompClient init
  //subscribe
  useEffect(() => {
    const connectWebSocket = () => {
       //sock js  
       const client = Stomp.over(() => new SockJS(`${baseURL}/chat`));

       client.connect({},()=>{

        setStompClient(client);  //  state setter

        toast.success("Connected"); //Toast notification

        client.subscribe(`/topic/room/${roomId}`, (message) => {  // ✅ Fixed function syntax
        console.log("Received Message:", message);
        const newMessage = JSON.parse(message.body);  //Parse JSON from the message body
        setMessages((prev) => [...prev, newMessage]); // Update state correctly
      });

       });
    };
    if(connected) {
    connectWebSocket();
    }
   //stomp client
  },[roomId]);

  //send message handle

  const sendMessage = async () => {
    if(stompClient && connected && input.trim()) {
      console.log(input)
      
      const message={
      sender: currentUser,
      content: input, 
      roomId: roomId
      }
      stompClient.send(`/app/sendMessage/${roomId}`,{},JSON.stringify(message),{});
      setInput("")
    }
  };

  //leave Room
  function handleLogout() {
    stompClient.disconnect()
    setConnected(false)
    setRoomId("")
    setCurrentUser("")
    navigate("/")
  }

  //  Trigger File Input
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  //  Handle File Selection and Send
    const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected File:", file.name);

   // Convert File to Base64 (or use FormData for actual upload)
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const fileMessage = {
          sender: currentUser,
          content: reader.result, // Base64 file content
          roomId: roomId,
          fileName: file.name
        };
        stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(fileMessage));
      };
    }
  };


  
  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 ">
      {/* Header */}
      <header className="border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center fixed top-0 w-full">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
          Room: <span className="font-normal">{roomId}</span>
        </h1>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
          User: <span className="font-normal">{currentUser}</span>
        </h1>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md">
          Leave Room
        </button>
      </header>

      <main ref={chatBoxRef} className="pt-20 px-10 w-full mx-auto overflow-auto h-screen bg-gray-200 dark:bg-slate-600" 
       style={{
        height: "calc(100vh - 80px)",
        backgroundImage: `url(${chatBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      }} >
     
          {
            messages.map((message,index)=>(
              <div key={index} className={`flex items-end ${message.sender === currentUser ? "justify-end" : "justify-start"} w-full`}>
  
               {/* Avatar (Only for Other Users) */}
            {message.sender !== currentUser && (
             <img 
             className="h-9 w-9 rounded-full border border-gray-500" 
             src="https://avatar.iran.liara.run/public/38" 
             alt="User Avatar" 
             />
             )}

             {/* Chat Bubble */}
            <div 
           className={`flex flex-col gap-1.5 p-3 max-w-[75%] rounded-xl shadow-lg transition-all 
            ${message.sender === currentUser ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-700 text-white rounded-bl-none"} 
            ${index === messages.length - 1 || messages[index + 1].sender !== message.sender ? "mb-4" : ""}`}
            
  >
             {/* Sender Name (Hidden for current user messages) */}
            {message.sender !== currentUser && (
            <p className="text-xs font-semibold text-gray-300">{message.sender}</p>
             )}

            {/* Message Content */}
            <p className="text-sm leading-relaxed break-words">{message.content}</p>

            {/* Timestamp (Optional) */}
            <p className='text-xs text-gray-200'>{timeAgo(message.timeStamp)}</p>
            </div>
            </div>

            ))}
      </main>

      {/* Chat Input Box */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 ">
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-md rounded-full py-2 px-4">
          <input
           value={input}
           onChange={(e)=> {setInput(e.target.value)}}
           onKeyDown={(e) => {
            if(e.key === "Enter") {
              sendMessage();
            }
           }}
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none px-3 py-2 text-gray-900 dark:text-gray-200 placeholder-gray-400"
          />
         <div className='flex gap-1'>
         <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileSelect} />
         <button onClick={triggerFileInput} className="hover:text-gray-600 dark:hover:text-gray-400 transition-all p-2 duration-200">
              <MdAttachFile size={24} />
            </button>
          <button onClick={sendMessage} className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white p-3 rounded-full shadow-md">
            <MdSend size={20} />
          </button>
         </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
