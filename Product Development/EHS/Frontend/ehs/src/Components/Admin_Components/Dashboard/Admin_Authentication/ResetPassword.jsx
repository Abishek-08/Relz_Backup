import React from "react";

const ResetPassword = () => {
  return (
    <div className="bg-gray-50">
      <div className="flex flex-col justify-center items-center px-6 pt-8 md:h-screen mx-auto">
        <a className="flex justify-center items-center text-2xl font-semibold mb-8 lg:mb-10">
          <img
            src="/src/assets/visionz_logo.png"
            alt="vision_logo"
            className="h-10 mr-4"
          />
          <span className="font-bold self-center whitespace-nowrap">EHS</span>
        </a>

        <div className="p-10 w-full max-w-lg bg-white rounded-lg shadow-2xl shadow-gray-300">
          <div className="space-y-8">
            <h2 className="text-2xl text-gray-900 font-semibold">
              Reset your password
            </h2>
            <form action="" className="mt-8 space-y-6">
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
              <div>
                <label
                  htmlFor="default-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="default-input"
                  placeholder="**********"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="default-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="default-input"
                  placeholder="**********"
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
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
