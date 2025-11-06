import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import { userReducer } from "./slices/authSlice";

const rootPersistConfig = {
  key: "root", // The key for the root reducer
  storage: storageSession, // Use session storage for persisting user data
  whitelist: ["user"], // user data can store in redux when press f5
};

// Combine all reducers
const reducers = combineReducers({
  user: userReducer,
});

// Process persist Reducer
const persistedReducer = persistReducer(rootPersistConfig, reducers);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
  });

  return store;
};

export const persistor = persistStore(makeStore());

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
