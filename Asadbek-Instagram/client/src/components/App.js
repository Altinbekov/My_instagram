
// import './App.css';
import "../styles/App.css";
import Navbar from "./Navbar.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { createContext, useState } from "react";
import SignUp from "./SignUp.js";
import SignIn from "./SignIn.js";
import Profile from "./Profile.js";
import Home from "./Home.js";
import Posts from "./Posts.js";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserProfile from "./UserProfile";

const LoginContext = createContext(false);
function App() {
const [isauth, setisauth] = useState(false);
const [modalOpen, setModalOpen] = useState(false);

return (
<BrowserRouter>
<div className="App">
<LoginContext.Provider value={{ setisauth, setModalOpen }}>
<Navbar login={isauth} setModalOpen={setModalOpen} />


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/createpost" element={<Posts />} />
        <Route path="/profile/:userid" element={<UserProfile />} />
      </Routes>
      {modalOpen && (
        <Modal setisauth={setisauth} setModalOpen={setModalOpen} />
      )}
    </LoginContext.Provider>
  </div>
  <ToastContainer
    position="top-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
  />
</BrowserRouter>
);
}

export default App;
export { LoginContext };
