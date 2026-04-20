import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../../Services/User_Services/UserService";

const User_Registration_Form = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState();
  const [imageSize, setImageSize] = useState(false);
  const [imageFormat, setImageFormat] = useState(false);
  const [image, setImage] = useState();
  const [invalidUserAlert, setInvalidUserAlert] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAlert, setNewPasswordAlert] = useState(false);
  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    setValue("file", file);
    await trigger("file");
    setImageUrl(URL.createObjectURL(file));
    console.log(file.type);
    if (
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg"
    ) {
      setImageFormat(false);
      if (file.size / 1000 > 1024) {
        setImageSize(true);
        setImage(false);
      } else {
        setImage(file);
        setImageSize(false);
      }
    } else {
      setImageFormat(true);
      setImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setImageSize(false);
    setImage(false);
  };

  const handleConfirmPassword = (e) => {
    if (newPassword !== e.target.value) {
      setNewPasswordAlert(true);
    } else {
      setNewPasswordAlert(false);
    }
  };

  const submitForm = (data) => {
    const formdata = new FormData();
    formdata.append("userEmail", data.userEmail);
    formdata.append("userName", data.userName);
    formdata.append("userGender", data.userGender);
    formdata.append("userPassword", data.userPassword);
    formdata.append("profileUpload", image);

    userRegister(formdata)
      .then((res) => {
        if (res.status === 200) {
          navigate("/signin");
          reset();
          setImage(false);
          setImageFormat(false);
          setImageSize(false);
          setImageUrl(false);
        }
      })
      .catch((err) => {
        if (err.response.status === 501) {
          console.log("file size exceed");
        } else if (err.response.status === 506) {
          setInvalidUserAlert(true);
          reset();
          setImage(false);
          setImageFormat(false);
          setImageSize(false);
          setImageUrl(false);
        }
      });
  };
  return (
    <div>
      {invalidUserAlert && (
        <div className="flex justify-center items-center md:relative">
          <div
            id="alert-2"
            className="absolute flex items-center w-100 mx-auto p-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 md:mx-auto mt-14"
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
              User with this Email is already Registered
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
          <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-lg shadow-indigo-500/100 dark:bg-gray-800 dark:border-gray-700">
            <form
              className="max-w-sm mx-auto"
              onSubmit={handleSubmit(submitForm)}
            >
              <div className="grid md:grid-cols-2 md:gap-12">
                <div className="relative z-0 w-full mb-5 group">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="name"
                    className={
                      errors.userName
                        ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                        : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    }
                    {...register("userName", {
                      required: "Name is required",
                    })}
                  />

                  {errors.userName && (
                    <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                      {errors.userName.message}
                    </p>
                  )}
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="name@gmail.com"
                    className={
                      errors.userEmail
                        ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                        : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    }
                    {...register("userEmail", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                        message: "Invalid email",
                      },
                    })}
                  />
                  {errors.userEmail && (
                    <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                      {errors.userEmail.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <label
                    htmlFor="newpassword"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newpassword"
                    className={
                      errors.newPassword
                        ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                        : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    }
                    placeholder="****"
                    {...register("newPassword", {
                      required: "password is required",
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                        message: "Atleast one a-z, A-Z, 0-9, !@#$%^&*()_+",
                      },
                      onChange: (e) => setNewPassword(e.target.value),
                    })}
                  />
                  {errors.newPassword && (
                    <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <label
                    htmlFor="confirmpassword"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmpassword"
                    className={
                      errors.userPassword
                        ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                        : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    }
                    placeholder="****"
                    {...register("userPassword", {
                      required: "password is required",
                      onChange: (e) => handleConfirmPassword(e),
                    })}
                  />
                  {errors.userPassword && (
                    <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                      {errors.userPassword.message}
                    </p>
                  )}
                  {newPasswordAlert && (
                    <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                      Password doesn't match
                    </p>
                  )}
                </div>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <label
                  htmlFor="gender"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  className={
                    errors.userGender
                      ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                      : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  }
                  {...register("userGender", {
                    required: "gender is required",
                  })}
                >
                  <option value="" disabled selected>
                    choose
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.userGender && (
                  <p className="mt-1 text-xs italic text-red-500">
                    {errors.userGender.message}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <div className="flex items-center justify-center w-full">
                  {image ? (
                    <div
                      class={`relative group border border-dashed border-2 ${
                        imageSize ? "border-red-700" : "border-slate-900"
                      } rounded-md `}
                    >
                      <img
                        className="w-full h-35 rounded-md group-hover:blur-[1px]"
                        src={imageUrl}
                        alt="dummy-image"
                      />
                      <span
                        onClick={handleRemoveImage}
                        className="absolute hidden w-full h-7 top-28 bg-red-500 text-white rounded group-hover:block"
                      >
                        <svg
                          className="w-6 h-6 text-gray-800  dark:text-white mx-auto"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm5.757-1a1 1 0 1 0 0 2h8.486a1 1 0 1 0 0-2H7.757Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                  ) : (
                    <label
                      htmlFor="dropzone-file"
                      className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                        errors.image || imageFormat || imageSize
                          ? "border-red-300  dark:border-red-600 dark:hover:border-red-500"
                          : "border-gray-300  dark:border-gray-600 dark:hover:border-gray-500"
                      } `}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, JPEG (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        {...register("image", {
                          required: "image is required",
                          onChange: handleFile,
                        })}
                      />
                    </label>
                  )}
                </div>
                {imageFormat && (
                  <p className="mt-1 text-xs italic text-red-500">
                    Invalid Image format
                  </p>
                )}
                {imageSize && (
                  <p className="mt-1 text-xs italic text-red-500">
                    Image size exceed 1MB
                  </p>
                )}
                {errors.image && (
                  <p className="mt-1 text-xs italic text-red-500">
                    {errors.image.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={imageSize}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
        <div className="hidden md:block object-bottom">
          <img src="/src/assets/signup.gif" alt="" />
        </div>
      </div>
    </div>
  );
};

export default User_Registration_Form;
