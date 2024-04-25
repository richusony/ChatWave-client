import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { loginSignUp } from "../utils/helper";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { SIGNIN_LOGIN_BG } from "../components/constants.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useLoggedInUser } from "../context/LoggedInUserCnxtProvider";

const LoginSignUp = () => {
  const loginBtn = useRef();
  const [info, setInfo] = useState(false);
  const { user, setUser } = useLoggedInUser();

  const googleLogin = async (e) => {
    setInfo(true)
    loginBtn.current.innerText = "Logging in...";
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userData = result.user;
      loginSignUp(userData.email, userData.displayName, userData.photoURL, setUser, loginBtn);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {info && <div className="absolute top-0 px-2 py-2 font-semibold bg-violet-400 text-gray-200 text-base text-center">
        <p>
          <FontAwesomeIcon icon={faInfoCircle} /> The login process is currently experiencing delays
          due to resource limitations on the server. We are actively
          working to improve the server infrastructure to enhance
          performance and reduce latency. Thank you for your understanding,
          and we apologize for any inconvenience caused.</p>
      </div>}
      {user && <Navigate to="/chats" />}
      <div className="pt-10 md:pt-0 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 md:h-screen relative">
          <img
            className="w-full h-full object-contain"
            src={SIGNIN_LOGIN_BG}
            alt="login-bg"
          />
        </div>

        <div className="mt-10 md:mt-0 flex flex-col md:justify-center items-center md:w-1/2">
          <div className="md:mb-5">
            <h1 className="mb-8 text-4xl text-center font-bold text-[#6c44fa]">
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
            <p className="md:px-8 text-sm text-center italic text-gray-500 font-bold">
              "An innovative real-time chat platform designed to create
              seamless, fluid conversations between users. With its intuitive
              interface and instant connectivity, ChatWave fosters dynamic
              interactions, enabling users to communicate effortlessly, share
              ideas, and engage in vibrant discussions."
            </p>
          </div>
          <button ref={loginBtn}
            onClick={googleLogin}
            className="mt-5 transition delay-150 py-2 px-6 font-semibold ease-linear bg-[#7474ff] hover:bg-[#5e5efa] hover:shadow-xl text-white rounded-full text-xl"
          >Try now</button>
        </div>
      </div>
    </div>
  );

};

export default LoginSignUp;
