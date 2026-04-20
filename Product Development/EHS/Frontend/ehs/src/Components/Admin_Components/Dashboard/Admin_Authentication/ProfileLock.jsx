import React from "react";

const ProfileLock = () => {
  return (
    <div className="bg-gray-50">
      <div className="flex flex-col justify-center items-center mx-auto px-6 pt-8 md:h-screen">
        <a className="flex justify-center items-center text-2xl font-semibold mb-8 lg:mb-10">
          <img
            src="/src/assets/visionz_logo.png"
            alt="ehs_logo"
            className="mr-4 h-12"
          />
          EHS
        </a>

        <div className="w-full bg-white rounded-lg shadow-2xl shadow-gray-300 md:mt-0 sm:max-w-screen-sm xl:p-0">
          <div className="w-full p-10">
            <div className="flex items-center gap-4">
              <img
                className="w-8 h-8 rounded-full"
                src="/src/assets/men.jpg"
                alt=""
              />
              <span className="mb-3 text-sm font-bold text-gray-900 lg:text-3xl">
                name
              </span>
            </div>

            <p className="text-base font-normal text-gray-500">
              Better to be safe than sorry.
            </p>
            <form className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="default-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="default-input"
                  placeholder="name@gmail.com"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    required
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="remember"
                    className="text-gray-900 font-medium"
                  >
                    I accept the
                    <a className="ml-1 text-blue-700 hover:underline cursor-pointer">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 hover:scale-[1.02] transition-transform sm:w-auto"
              >
                <svg
                  className="mr-2 -ml-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z"></path>
                </svg>
                Unlock
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLock;
