import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import CryptoJS from "crypto-js";

import surveyReducer from "./features/survey/surveySlice";
import feedbackReducer from "./features/feedback/feedbackSlice";

// Encryption key (keep this safe, ideally in environment variables)
const secretKey = import.meta.env.VITE_SESSION_SECRET_KEY;

// Transform to encrypt before saving and decrypt when loading
const encryptTransform = createTransform(
  // Called before saving to storage
  (inboundState) => {
    const stringifiedState = JSON.stringify(inboundState);
    const encryptedState = CryptoJS.AES.encrypt(
      stringifiedState,
      secretKey,
    ).toString();
    return encryptedState;
  },
  // Called when retrieving from storage
  (outboundState) => {
    try {
      const bytes = CryptoJS.AES.decrypt(outboundState, secretKey);
      const decryptedState = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedState);
    } catch (err) {
      console.error("Decryption error:", err);
      return outboundState;
    }
  },
);

const rootPersistConfig = {
  key: "root",
  storage,
  transforms: [encryptTransform], // Add encryption transform
};

const appReducer = combineReducers({
  survey: surveyReducer,
  feedback: feedbackReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") {
    storage.removeItem("persist:root");
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
        ],
      },
    }),
});

export const persistor = persistStore(store);
