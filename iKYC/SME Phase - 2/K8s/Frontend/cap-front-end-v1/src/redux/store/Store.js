import { configureStore } from "@reduxjs/toolkit";
import OverallReducer from "../reducers/OverallReducer";
import { persistStore,persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; //local storage

const persistConfig = {
  key: "root",
  storage,
}

//Its a static don't change this file

const  persistedReducer = persistReducer(persistConfig,OverallReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools:
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(),
});

export const persistor = persistStore(store);

export default store;



