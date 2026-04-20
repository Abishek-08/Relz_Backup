import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { userLogin } from "../../Services/User_Services/UserService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handleLogging } from "../../Redux/User_Slice/UserSlice";

const User_Login_Form = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [invalidUserAlert, setInvalidUserAlert] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleSubmitForm = (data) => {
    console.log(data);
    userLogin(data)
      .then((res) => {
        if (res.status === 200) {
          reset();
          dispatch(handleLogging(res.data));
          navigate("/");
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          reset();
          setInvalidUserAlert(true);
        }
      });
  };

  return (
    <div>
      {invalidUserAlert && (
        <div className="flex justify-center items-center md:relative">
          <div
            id="alert-2"
            className="absolute flex items-center w-100 mx-auto p-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 md:mx-auto mt-20"
            role="alert"
          >
            <svg
              className="shrink-0 w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div className="ms-3 text-sm font-medium">
              Invalid Username or Password
            </div>
            <button
              type="button"
              className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
              data-dismiss-target="#alert-2"
              aria-label="Close"
              onClick={() => setInvalidUserAlert(false)}
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      <div className="flex grid sm:justify-center items-center h-screen md:grid-cols-2 gap-10">
        <div className="flex justify-center items-center">
          <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form
              className="space-y-6"
              onSubmit={handleSubmit(handleSubmitForm)}
            >
              <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                Sign in to our platform
              </h5>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="name@gmail.com"
                  {...register("userEmail", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                      message: "Invalid email",
                    },
                  })}
                />
                {errors.userEmail && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.userEmail.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  {...register("userPassword", {
                    required: "Password is required",
                  })}
                />
                {errors.userPassword && (
                  <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.userPassword.message}
                  </p>
                )}
              </div>
              <div className="flex items-start">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      type="checkbox"
                      defaultValue=""
                      className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <label
                    htmlFor="remember"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
                >
                  Lost Password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Sign in
              </button>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                Not registered?{" "}
                <a
                  onClick={() => navigate("/signup")}
                  className="text-blue-700  hover:underline cursor-pointer dark:text-blue-500"
                >
                  Create account
                </a>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden md:block">
          <img src="/src/assets/signin.gif" className="h-100 w-100" alt="" />
        </div>
      </div>
    </div>
  );
};

export default User_Login_Form;
