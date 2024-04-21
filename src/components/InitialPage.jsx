import wave from "../assets/others/ailogo-removebg-preview.png";

const InitialPage = () => {

  return (
    <div className="px-2 min-h-screen flex flex-col justify-center items-center">
      <div className="flex justify-center items-center w-full">
        <h1 className="mb-4 text-4xl font-bold text-gray-600">
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
        <div className="w-20 h-14">
          <img
            className="w-full h-full object-cover hue-rotate-60"
            src={wave}
            alt="wave"
          />
        </div>
      </div>

      <p className="px-4 text-lg text-center italic text-gray-500">
        "An innovative real-time chat platform designed to create seamless,
        fluid conversations between users. With its intuitive interface and
        instant connectivity, ChatWave fosters dynamic interactions, enabling
        users to communicate effortlessly, share ideas, and engage in vibrant
        discussions."
      </p>

      <div className="mt-5 text-center">
        <a href="https://github.com/richusony/ChatWave.git" className="bg-[#9c9cff] hover:bg-[#7474ff] py-2 px-4 rounded-full text-white shadow-md">
          Learn more
        </a>
      </div>
    </div>
  );
};

export default InitialPage;
