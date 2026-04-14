/*
 * @aurthor: sundhar raj s - 12106
 * @since: 01-07-2024
 * @version: 1.0
 * @purpose: LoginComponent.js
 *
 */

import axiosInstance from "../axiosInstance";

import {
  LOGIN_API,
  OTP_VERIFICATION_API,
  OTP_RESEND_API,
  UPDATE_PASSWORD_API,
  RESET_PASSWORD_API,
} from "../../constants/user_module_constants/APIConstants";

export const login = async (user) => {
  console.log(user, LOGIN_API);
  try {
    const response = await axiosInstance.post(LOGIN_API, user);
    const { token } = response.data;

    // Store token securely
    localStorage.setItem("jwt", token);

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const verifyOtp = async (email, otp) => {
  console.log(await email, otp);
  try {
    const response = await axiosInstance.post(
      `${OTP_VERIFICATION_API}${await email}&otp=${otp}`
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const resendOtp = async (email) => {
  try {
    const response = await axiosInstance.post(`${OTP_RESEND_API}${email}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const resetPassword = async (email, password) => {
  try {
    const response = await axiosInstance.put(`${RESET_PASSWORD_API}`, {
      email: email,
      password: password,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const updatePassword = async (login) => {
  try {
    const email = sessionStorage.getItem("userEmail");
    const response = await axiosInstance.put(
      `${UPDATE_PASSWORD_API}${login.newPassword}`,
      {
        email: email,
        password: login.oldPassword,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminUpdatePassword = async (login) => {
  try {
    const email = sessionStorage.getItem("adminEmail");
    console.log(email, login);
    const response = await axiosInstance.put(
      `${UPDATE_PASSWORD_API}${login.newPassword}`,
      {
        email: email,
        password: login.oldPassword,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
