import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import storageSession from "redux-persist/lib/storage/session";
import loginReducer from "./User_Slice/UserSlice";
import adminDashReducer from "./AdminDashboard_Slice/AdminDashboardSlice";
import vehicleReducer from "./Application/VehicleSlice";

const rootPersistConfig = {
  key: "root",
  storage,
};

const loginPersistConfig = {
  key: "login",
  storage: storageSession,
};

const rootReducer = combineReducers({
  login: persistReducer(loginPersistConfig, loginReducer),
  adminDashSlice: adminDashReducer,
  vehicleSlice: vehicleReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
