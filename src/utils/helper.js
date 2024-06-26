import axios from "axios";

export async function loginSignUp(
  email,
  fullname,
  profile_img,
  setUser,
  loginBtn
) {
  loginBtn.current.disabled = true;
  loginBtn.current.innerText = "Logging in...";
  // console.log("reached", email, fullname, profile_img);
  const reqData = {
    email,
    fullname,
    profile_img,
  };
  // await axios.post("/api/auth/login-signup", {});
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_DOMAIN}/api/auth/login-signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(reqData),
    }
  );

  if (res.status == 201 || res.status == 200) {
    loginBtn.current.innerText = "Try now";
    loginBtn.current.disabled = false;
    const resData = await res.json();
    sessionStorage.setItem("login-user", JSON.stringify(resData));
    setUser(resData);
  } else {
    loginBtn.current.innerText = "Try now";
    loginBtn.current.disabled = false;
    alert(res.status, "error while logging");
  }
  // console.log("response from backend  ", resData);
}

export async function getUsers() {
  // console.log("reached");
  const res = await axios.get(
    `${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/`,
    { withCredentials: true }
  );
  return res.data;
  // console.log("all users from backend  ", res);
}

export function extractTime(dateString) {
  const date = new Date(dateString);
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());

  // Check if the hours are less than 12 to determine am/pm
  if (hours < 12) {
    return `${hours}:${minutes} am`; // Return time in am format
  } else {
    // Convert 24-hour format to 12-hour format for pm
    const pmHours = hours === 12 ? hours : hours - 12;
    return `${pmHours}:${minutes} pm`; // Return time in pm format
  }
}

// Helper function to pad single digits with a leading zero
function padZero(number) {
  return number.toString().padStart(2, "0"); // Pad with leading zero if needed
}

// Function to format date as "Wed Apr 10 2024" format
function formatDate(date) {
  const options = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

// Function to get today's date
export function getTodayDate() {
  const today = new Date();
  return formatDate(today);
}

// Function to get yesterday's date
export function getYesterdayDate() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return formatDate(yesterday);
}

export const getAllMessages = async (setUserData, setFilteredUser) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_DOMAIN}/api/messages/get/messages`,
      { withCredentials: true }
    );
    setUserData(res.data);
    setFilteredUser(res.data);
  } catch (error) {
    console.log(error);
  }
};

export const getAllGroups = async (setGroupData, setFilteredGroups) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/get/groups`,
      { withCredentials: true }
    );
    setGroupData(res.data);
    setFilteredGroups(res.data);
  } catch (error) {
    console.log(error);
  }
};
