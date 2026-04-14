import { updatePassword } from "../../../redux/actions/user_module_actions/userAction";

export const updateUserPassword = async (userEmail, oldPassword, newPassword) => {
  try {
    const response = await updatePassword(userEmail, oldPassword, newPassword);
    return response; // Assuming updatePassword returns a promise
  } catch (error) {
    throw error;
  }
};
