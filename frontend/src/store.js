import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // You can choose a different storage solution if needed
import { userReducer, PostOfFollowingReducer, AllUsersReducer } from "./Reducers/User";
import { likeReducer, myPostsReducer } from "./Reducers/Post";


// Create a persist configuration
const persistConfig = {
  key: "root", // Key to store the data in local storage
  storage, // Storage solution (e.g., local storage)
};

// Wrap your userReducer with the persistReducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    postOfFollowing: PostOfFollowingReducer,
    allUsers: AllUsersReducer,
    like:likeReducer,
    myPosts:myPostsReducer,
  },
});

const persistor = persistStore(store); // Create a persistor

export { store, persistor };
