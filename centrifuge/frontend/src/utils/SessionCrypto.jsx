import CryptoJS from "crypto-js";

const KEY = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_SESSION_SECRET_KEY);
const IV = CryptoJS.enc.Base64.parse(import.meta.env.VITE_SESSION_IV);

export const encryptSession = (data) => {
  return CryptoJS.AES.encrypt(data, KEY, { iv: IV }).toString();
};

export const decryptSession = (sessionData) => {
  if (!sessionData) return null;
  try {
    const decrypted = CryptoJS.AES.decrypt(sessionData, KEY, { iv: IV });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("Decryption failed", err);
    return null;
  }
};
