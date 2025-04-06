import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import DarkModeToggle from "./components/DarkModeToggle";
import { BsMoon, BsSun } from "react-icons/bs"; // Import Icons
import "./App.css";
import JoinCreateChat from "./components/JoinCreateChat";

function App() {
    return (
  <div>
     <JoinCreateChat />
  </div>
  );
}

export default App;
