import { createReducer } from "@reduxjs/toolkit";
const initialState = {}

export const userReducer = createReducer(initialState, {
    //Login User
    LoginRequest: (state) => {
        state.loading = true;
        
    },
    LoginSuccess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    LoginFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },
    
    //Register User
    RegisterRequest: (state) => {
        state.loading = true;
    },
    RegisterSuccess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
    },
    RegisterFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    //Load User
    LoadRequest: (state) => {
        state.loading = true;
    },
    LoadSuccess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    LoadFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },
    clearErrors: (state) => {
        state.error = null;
    },
});

//Get post of Following Reducer.

export const PostOfFollowingReducer = createReducer(initialState, {
    postOfFollowingRequest: (state) => {
        state.loading = true;
    },
    postOfFollowingSuccess: (state, action) => {
        state.loading = false;
        state.posts = action.payload;
    },
    postOfFollowingFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors: (state) => {
        state.error = null;
    },
    
});

//Get all Users.
export const AllUsersReducer = createReducer(initialState, {
    allUsersRequest: (state) => {
        state.loading=true
    },
    allUsersSuccess: (state, action) => { 
        state.loading = false;
            state.users = action.payload;
    },
    allUsersFailure: (state, action) => { 
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors: (state) => {
        state.error = null;
    },

})