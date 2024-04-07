import React, { useContext, useState } from "react";
import loginBg from "../assets/others/login-bg.jpg";
import wave from "../assets/others/wave.png";
import UserContext from "../context/LoggedInUserContexs";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { loginSignUp } from "../utils/helper";
import { Navigate } from "react-router-dom";
import LoggedInUserContext from "../context/LoggedInUserContexs";
import { useLoggedInUser } from "../context/LoggedInUserCnxtProvider";

const LoginSignUp = () => {
  const {user,setUser} = useLoggedInUser();
  // const [user, setUser] = useState();
  const googleLogin = async (e) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userData = result.user;
      loginSignUp(userData.email, userData.displayName, userData.photoURL, setUser);
      // Now you can access user details such as email, name, and profile picture
  
      // setUser({
      //   email: userData.email,
      //   name: userData.displayName,
      //   profileUrl: userData.photoURL
      //     ? userData.photoURL
      //     : "https://robohash.org/123",
      // });
      // You can then use these details as needed, such as storing them in state or passing them to other components
      // console.log('User Email:', userEmail);
      // console.log('User Name:', userName);
      // console.log('Profile Picture:', userProfilePicture);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {user && <Navigate to="/chats" />}
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-screen relative">
          <img
            className="w-full h-full object-cover"
            src={loginBg}
            alt="login-bg"
          />
          <div className="absolute top-0 right-0 w-full h-full bg-violet-500 opacity-50"></div>
          <div className="absolute top-0 right-0 w-full h-full flex flex-col justify-center items-center">
            <div className="flex justify-center items-center w-full ">
              <h1 className="mb-4 text-4xl font-bold text-white">
                Chat
                <span className="transition delay-150 ease-linear hover:text-violet-500">
                  W
                </span>
                <span className="transition delay-150 ease-linear hover:text-violet-500">
                  a
                </span>
                <span className="transition delay-150 ease-linear hover:text-violet-500">
                  v
                </span>
                <span className="transition delay-150 ease-linear hover:text-violet-500">
                  e
                </span>
              </h1>
              <div className="w-24">
                <img
                  className="w-full h-full object-cover hue-rotate-60"
                  src={wave}
                  alt="wave"
                />
              </div>
            </div>
            <p className="px-4 text-lg text-center italic text-white font-bold">
              "An innovative real-time chat platform designed to create
              seamless, fluid conversations between users. With its intuitive
              interface and instant connectivity, ChatWave fosters dynamic
              interactions, enabling users to communicate effortlessly, share
              ideas, and engage in vibrant discussions."
            </p>
            <div className="md:hidden mt-4 flex justify-center items-center w-1/2">
              <button
                onClick={googleLogin}
                className="transition delay-150 py-2 px-8 w-fit ease-linear bg-[#7474ff] hover:bg-[#5e5efa] hover:shadow-xl text-white rounded-full text-md"
              >
                Login or SignUp with Google
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:flex justify-center items-center w-1/2">
          <button
            onClick={googleLogin}
            className="transition delay-150 py-2 px-4 ease-linear bg-[#7474ff] hover:bg-[#5e5efa] hover:shadow-xl text-white rounded-full text-xl"
          >
            Login or SignUp with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
